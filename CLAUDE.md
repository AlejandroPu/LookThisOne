@AGENTS.md

# LookThisOne — AI Agent Guide

This file is automatically loaded in every Claude Code session (and other
compatible agents). It documents **how to work** in this repo: workflow,
architecture, conventions, and constraints.

For the product pitch and local setup, read `README.md`.

---

## What the project is

**LookThisOne** — link-in-bio SaaS.
Target domain: `lookthis.one`.
The repo is **public** and also serves as the developer's portfolio.

---

## Stack

| Layer     | Technology                                     |
| --------- | ---------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack build)       |
| Language  | TypeScript                                     |
| Styles    | Tailwind CSS v4                                |
| Database  | PostgreSQL (Supabase)                          |
| ORM       | Prisma 7 + driver adapter `@prisma/adapter-pg` |
| Auth      | Supabase Auth (via `@supabase/ssr`)            |
| Storage   | Supabase Storage                               |
| Hosting   | Vercel (auto-deploy from `main`)               |

---

## Architecture

```
Visitor → Vercel CDN → Next.js App Router
                           ├── /[username]       (ISR, revalidate 60s)
                           ├── /dashboard        (private SPA, auth-gated)
                           └── API Routes
                                 ↓
                         Supabase (Postgres + Auth + Storage)
```

### Data model

Multi-tenant from the start:

```
users → workspaces → pages → links
                           → themes
                           → analytics_events
```

- `users.id` = `auth.users.id` from Supabase (UUID).
- A user can belong to multiple `workspaces` via `workspace_members`.
- Each `workspace` has multiple `pages`; each page has multiple `links`.
- `analytics_events` is kept separate; candidate for migration to ClickHouse/Tinybird
  when it scales.

### Security

- **RLS enabled on all tables** (see `prisma/migrations/*_rls_policies`).
- Prisma connects with the `postgres` role (superuser) and **bypasses RLS** —
  server-side operations work without restriction.
- The Supabase browser client (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) **is**
  subject to RLS. Current policies: public read of published pages, active links
  of published pages and themes; anonymous insert into `analytics_events`.
  Everything else is blocked until an auth flow exists.

---

## Development workflow

### `main` branch protection

The `main` branch **is protected**:

- No direct pushes allowed.
- Changes come in via Pull Request.
- The `Lint, typecheck & build` check must pass.
- Force-push and branch deletion are not allowed.
- Linear history required.

### Change cycle

```bash
git checkout main && git pull              # sync with remote
git checkout -b <type>/<kebab-name>        # create feature branch
# ... edit, commit ...
git push -u origin <branch>               # publish branch
gh pr create --title "..." --body "..."   # open PR
# Wait for green CI, review diff on GitHub
# → the owner merges from the GitHub UI (see below)
```

### Automated pre-merge review

Before asking the owner to merge, invoke the **`pr-reviewer`** subagent
(defined in `.claude/agents/pr-reviewer.md`). It reads the PR diff with
fresh eyes and returns a short verdict (`PASS` / `CHANGES REQUESTED` /
`BLOCK`) against a quality checklist that goes beyond what CI covers:
competitor brand names in copy, leftover `TODO`s, boilerplate residue,
accessibility, scope creep, missing migrations, etc.

Rules:

- Only invoke it **after CI is green**. If CI is red, fix that first.
- Skip it for trivial docs-only typo PRs.
- If the verdict is `BLOCK` or `CHANGES REQUESTED`, apply the fixes as new
  commits on the same branch and re-invoke.
- Only once the verdict is `PASS`, tell the owner the PR is ready to merge.

### Who merges (role separation)

Merging to `main` is an **ownership act**: it marks code entering production
and triggers the automatic Vercel deploy. Therefore:

- **AI agents (Claude Code, etc.) do NOT run `gh pr merge`.**
  Their job ends at opening the PR and confirming CI is green.
- **The repo owner** reviews the diff on GitHub and does the squash-merge +
  delete branch from the UI (or manually with `gh pr merge --squash --delete-branch`).
- After the merge, the agent (or dev) syncs: `git checkout main && git pull`,
  deletes the local branch, and continues with the next task.

This preserves the _four-eyes principle_ even in a solo-developer repo, and
prevents irreversible actions on `main` from happening without a final human review.

### Branch conventions

| Prefix   | Purpose                                      |
| -------- | -------------------------------------------- |
| `feat/`  | new feature                                  |
| `fix/`   | bug fix                                      |
| `chore/` | tooling, dependencies, refactor without feat |
| `docs/`  | documentation only                           |
| `test/`  | tests                                        |

E.g.: `feat/dashboard-login`, `fix/isr-cache-invalidation`, `docs/readme-badges`.

### Commits

We use **Conventional Commits** with prefixes: `feat:`, `fix:`, `chore:`,
`docs:`, `test:`, `refactor:`, `perf:`, `style:`, `ci:`.

Example:

```
feat(dashboard): magic-link email login

Implements sign-in with Supabase Auth using email OTP.
Redirects to /dashboard after the callback.
```

The **squash merge** of each PR leaves one commit per feature on `main` —
`git log` reads as a feature timeline.

### Automatic pre-commit

`husky` + `lint-staged` run on every `git commit`:

- ESLint (`--fix`) and Prettier (`--write`) over staged files.
- If lint/format fails, the commit is aborted. Fix and retry.

### CI on every PR

`.github/workflows/ci.yml` runs in this order:

1. `npm run format:check`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`

All must pass before merging.

---

## Useful commands

```bash
npm run dev               # Next.js in dev mode
npm run build             # production build (generates Prisma + compiles Next)
npm run lint              # ESLint
npm run format            # Prettier --write across the whole repo
npm run format:check      # Prettier --check (what CI runs)
npm run typecheck         # tsc --noEmit

# Prisma (reads .env.local via dotenv-cli)
npm run prisma:migrate    # create/apply migration in dev
npm run prisma:deploy     # apply migrations in prod (for CI/Vercel)
npm run prisma:studio     # UI to browse/edit data
npm run prisma:generate   # regenerate Prisma Client
```

---

## Code conventions

- **Absolute imports** via `@/` alias (configured in `tsconfig.json`).
  Example: `import { prisma } from '@/lib/prisma'`.
- **Server-first**: use Server Components and Server Actions by default.
  Mark `'use client'` only when needed (interactivity, browser hooks).
- **Reads (public and authenticated)**: use Prisma from Server Components.
  It bypasses RLS, gives end-to-end typing, and avoids duplicating ownership
  rules as SQL policies. Always verify `auth.getUser()` first and scope the
  query to the caller's `userId` / workspace.
- **Writes from the authenticated UI**: Server Actions with Prisma, wrapped
  in a transaction when they span multiple tables (see
  `src/app/onboarding/actions.ts`). Re-resolve the target entity from the
  session — never trust a hidden `id` field on the form.
- **Supabase client on the server**: only for auth (`auth.getUser`,
  `signIn*`, OAuth redirects). Prefer Prisma for data.
- **Supabase client in the browser**: reserved for features that genuinely
  need it (realtime subscriptions, optimistic UI against RLS-protected
  tables). Not used yet.
- **Images**: prefer `next/image` when possible; the current `<img>` in
  `/[username]` is temporary (avatars come from an external Supabase Storage
  URL and require configuring `images.remotePatterns` — pending).

---

## What NOT to do

- ❌ **Do not touch the legacy site on Hostinger** (`lookthis.one` currently
  serves an old vanilla HTML/CSS/JS version — not in this repo).
- ❌ **Do not commit secrets**: `.env*` is in `.gitignore` (except
  `.env.example`). If a secret appears in history, rotate it immediately.
- ❌ **Do not bypass RLS from the client**: for privileged reads/writes from
  the UI, go through a Server Action or API Route with Prisma.
- ❌ **Do not push to `main`**: not even an empty commit. Always branch + PR.
- ❌ **Do not run `prisma migrate reset` in prod**: it wipes all data.
  Dev local only.
- ❌ **Do not merge with CI red**: the ruleset prevents it, but even if you
  could — don't.

---

## External infrastructure (quick reference)

- **GitHub**: `https://github.com/AlejandroPu/LookThisOne`
- **Vercel**: project `look-this-one`, auto-deploy from `main`.
- **Supabase**: project at `gogaohyatpsmtqisiyat.supabase.co` (Free tier).
  Data API enabled, automatic RLS enabled.

Required environment variables: see `.env.example`.

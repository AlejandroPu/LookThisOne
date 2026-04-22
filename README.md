# LookThisOne

A professional link-in-bio SaaS — one page, all your links, with analytics and multi-workspace collaboration built in.

[![CI](https://github.com/AlejandroPu/LookThisOne/actions/workflows/ci.yml/badge.svg)](https://github.com/AlejandroPu/LookThisOne/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deploy on Vercel](https://img.shields.io/badge/Vercel-deploy-black?logo=vercel)](https://vercel.com)

**Live:** [lookthis.one](https://lookthis.one) &nbsp;·&nbsp; **Repo:** [github.com/AlejandroPu/LookThisOne](https://github.com/AlejandroPu/LookThisOne)

> The landing and UI currently ship with placeholder copy and minimal styling. Product polish is intentionally deferred until after the core flows (auth, dashboard, editor) land.

---

## Features

- **Public profile pages** at `/[username]`, served with Next.js ISR and on-demand revalidation so creator edits appear instantly while the CDN absorbs visitor traffic.
- **Multi-tenant from day one** — `users → workspaces → pages → links` — ready for team/agency plans without a painful migration later.
- **Row-Level Security** enabled on every table. Server uses Prisma (bypasses RLS); browser uses Supabase client (respects RLS).
- **First-party analytics** table, designed to migrate to a purpose-built store (Tinybird / ClickHouse) when volume justifies it.
- **Professional workflow**: protected `main`, PR-only merges, required CI, Conventional Commits, squash history.

---

## Architecture

```
Visitor → Vercel CDN → Next.js App Router
                         ├── /[username]       (ISR, revalidate 60s)
                         ├── /dashboard        (private SPA, auth)
                         └── API Routes
                               ↓
                       Supabase (Postgres + Auth + Storage)
```

### Data model

```
users ─┬─ workspace_members ─ workspaces ─┬─ pages ─┬─ links
       │                                  │         └─ analytics_events
       └─ auth.users (Supabase)           └─ themes
```

- `users.id` mirrors `auth.users.id` from Supabase Auth (UUID).
- Every table has RLS policies; anonymous visitors can read published pages, their enabled links, and themes, and can insert analytics events. Everything else is denied until authenticated flows land.

### Stack

| Layer     | Choice                                    |
| --------- | ----------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack build)  |
| Language  | TypeScript                                |
| Styling   | Tailwind CSS v4                           |
| Database  | PostgreSQL (Supabase)                     |
| ORM       | Prisma 7 with `@prisma/adapter-pg` driver |
| Auth      | Supabase Auth via `@supabase/ssr`         |
| Storage   | Supabase Storage                          |
| Hosting   | Vercel (auto-deploy from `main`)          |
| CI        | GitHub Actions (lint, typecheck, build)   |
| Tooling   | ESLint, Prettier, Husky, lint-staged      |

---

## Local development

### Prerequisites

- Node.js 22+
- npm 10+
- A Supabase project (free tier is enough)

### Setup

```bash
git clone https://github.com/AlejandroPu/LookThisOne.git
cd LookThisOne
npm install
cp .env.example .env.local
# Fill in .env.local with your Supabase values
npm run prisma:migrate      # apply schema + RLS policies
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

See [`.env.example`](./.env.example). At minimum:

| Variable                               | Purpose                                      |
| -------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase project URL (public)                |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable key (public)            |
| `DATABASE_URL`                         | Pooled Postgres connection (runtime queries) |
| `DIRECT_URL`                           | Direct Postgres connection (migrations)      |

---

## Scripts

| Command                   | What it does                                      |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Next.js dev server                                |
| `npm run build`           | Generate Prisma client + production build         |
| `npm run start`           | Run the production build locally                  |
| `npm run lint`            | ESLint                                            |
| `npm run format`          | Prettier `--write` over the repo                  |
| `npm run format:check`    | Prettier `--check` (the one CI runs)              |
| `npm run typecheck`       | `tsc --noEmit`                                    |
| `npm run prisma:migrate`  | Create/apply a migration in dev                   |
| `npm run prisma:deploy`   | Apply migrations in prod (intended for CI/Vercel) |
| `npm run prisma:studio`   | Prisma Studio                                     |
| `npm run prisma:generate` | Regenerate Prisma Client                          |

---

## Project structure

```
src/
  app/
    layout.tsx               # Root layout, metadata, fonts
    page.tsx                 # Landing
    [username]/page.tsx      # Public profile (ISR)
    globals.css              # Tailwind entry + design tokens
  lib/
    prisma.ts                # Prisma singleton (pg adapter)
    supabase/
      client.ts              # Browser Supabase client
      server.ts              # Server Supabase client (cookies)
prisma/
  schema.prisma              # Multi-tenant data model
  migrations/                # Versioned SQL, including RLS policies
.github/workflows/ci.yml     # Lint, typecheck, build
```

---

## Workflow

- `main` is protected: no direct pushes, no force-pushes, linear history, required CI check.
- Every change lands via a Pull Request, squash-merged so the log reads as one commit per feature.
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, `perf:`, `style:`, `ci:`).
- Pre-commit hook runs ESLint `--fix` and Prettier over staged files via `husky` + `lint-staged`.

See [`CLAUDE.md`](./CLAUDE.md) for the full contributor guide (also read by AI agents working on this repo).

---

## Roadmap

- [x] Multi-tenant schema with RLS
- [x] Public `/[username]` page with ISR
- [x] Protected `main`, CI, professional tooling
- [ ] Supabase Auth flows (sign-in, sign-up, session)
- [ ] Dashboard: create/edit pages and links
- [ ] Theme editor
- [ ] Visual redesign (planned with Claude Design)
- [ ] Analytics dashboard
- [ ] Custom subdomains on paid plans

---

## License

Source-available for learning and review. Not licensed for production use, redistribution, or commercial derivatives.

© Alejandro Pu. All rights reserved.

# Sonnet lane — feature work and full PR lifecycle

You are running in the **Sonnet terminal**. This is the default lane —
all non-Opus-worth work happens here, from first commit to post-merge cleanup.

## What you DO

- Pick up tasks from `.private/backlog.md` "Next up" that are not `Opus-worth`
  — feature flows, multi-file changes, small mechanical edits, anything
  requiring real judgment about API shape or data flow.
- Own the **full PR lifecycle**: code → commit → open PR → wait for CI green →
  run `pr-reviewer` (loop until PASS) → hand off to user for merge → after
  merge, do cleanup yourself (`git checkout main && git pull && git branch -d <branch>`).
- End every turn that needs a handoff with one of the standard emoji lines
  (see below).

## What you NEVER do

- ❌ **Never run `gh pr merge`.** The user owns merges (four-eyes principle,
  see `CLAUDE.md` → "Who merges").
- ❌ **Never start an `Opus-worth` task** (architecture-level decisions,
  hard debugging, multi-system design). Hand back to user with a
  `stop_reason`.
- ❌ **Never skip `pr-reviewer`** on a non-docs PR, even if the diff "looks
  obviously fine".

## Standard feature flow

1. `git checkout main && git pull`
2. `git checkout -b <type>/<kebab-name>`
3. Write code, commit.
4. `git push -u origin <branch>` → `gh pr create`
5. Wait for CI green.
6. Run `pr-reviewer`. If `CHANGES REQUESTED` / `BLOCK`: fix, commit, push,
   wait for CI, re-invoke. Loop until `PASS`.
7. Update baton (`to: user`, `stop_reason: pr-reviewer PASS — merge is the user's call`).
8. End turn with:

   > ✅ **PR #N listo para squash-merge.**
   > `pr-reviewer` verdict: PASS. Merge desde la UI de GitHub.

9. After the user merges: `git checkout main && git pull && git branch -d <branch>`.
   Update baton to clean state. End turn with:

   > ✅ **LISTO — main sincronizado, rama local borrada.**

## Escalating to Opus mid-task

A `Sonnet-fit` task can reveal unexpected complexity once you're inside it.
If you hit a blocker — a bug that survives two attempts, an architectural
decision you're not confident about, or cross-cutting concerns you didn't
anticipate — **stop and escalate rather than forcing through**.

Protocol:

1. Stop where you are. Do not push broken or half-finished code.
2. Update `.private/baton.md`:
   - `to: opus`
   - `next: <one-line description of the blocker>`
   - `stop_reason: bloqueado — escala a Opus`
3. End your turn with:

   > 🛑 **PARADA — cambia a la terminal de Opus.**
   > Bloqueado en: [descripción concisa]. Ver baton para contexto.

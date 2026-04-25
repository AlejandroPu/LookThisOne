# Haiku lane — mechanical work

You are running in the **Haiku terminal**. Stay in your lane. Read this in
full before acting on any task picked up from `.private/baton.md`.

## What you DO

- Open PRs for tasks the baton marks as `Haiku-fit` (small, mechanical, well
  scoped — single-file UX polish, copy tweaks, dependency bumps, etc.).
- Commit + push + `gh pr create`. Wait for CI green.
- **Cleanup after the user merges**: `git checkout main && git pull &&
git branch -d <branch>`. Update baton to a clean state.

## What you NEVER do

- ❌ **Never invoke the `pr-reviewer` subagent.** That belongs to Sonnet.
- ❌ **Never tell the user "the PR is ready to merge".** It is not — it
  hasn't been reviewed yet.
- ❌ **Never start a task the baton marks as `Sonnet-fit` or `Opus-worth`.**
  If the baton points you at one of those, write a `stop_reason` and hand
  back to the user.
- ❌ **Never edit files outside the narrow scope of the assigned task.**
  Architectural calls, refactors, and "while I'm here" cleanups are out of
  lane.

## The mandatory STOP after CI green

After `gh pr create` succeeds AND CI is green, you are done. You must:

1. Update `.private/baton.md` with:
   - `to: sonnet`
   - `next: run pr-reviewer on PR #<N>, apply fixes, loop until PASS`
   - `stop_reason: out of lane — pr-reviewer is sonnet's job`
2. End your turn with this exact message to the user (Spanish — the user's
   primary language):

   > 🛑 **PARADA — cambia a la terminal de Sonnet.**
   > PR #N abierta con CI verde. Pendiente: `pr-reviewer`.
   > Vuelve a esta terminal solo después del squash-merge para hacer cleanup.

3. Stop. Do not continue. Do not run pr-reviewer "just to help".

## The cleanup flow (after user merges)

When the user returns and confirms the merge happened:

1. `git checkout main && git pull`
2. `git branch -d <merged-branch>` (use `-D` only if Git complains and you've
   verified the branch is truly merged via `gh pr view <N> --json state`).
3. Update baton: `branch: main`, `dirty: -`, `next: aguardar siguiente
tarea`, `stop_reason: cleanup done`.
4. End your turn with:

   > 🧹 **CLEANUP DONE** — main sincronizado, rama local borrada.
   > Listo para la siguiente tarea.

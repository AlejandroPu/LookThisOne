# Sonnet lane — feature work and review

You are running in the **Sonnet terminal**. This is the default lane —
most non-trivial feature work and all `pr-reviewer` runs happen here.

## What you DO

- Pick up `Sonnet-fit` tasks from `.private/backlog.md` "Next up" — feature
  flows, multi-file changes, anything requiring real judgment about API
  shape or data flow.
- Run **`pr-reviewer`** on PRs Haiku opened. Apply fixes on the same branch,
  push, wait for CI, re-invoke. Loop until verdict is `PASS`.
- Hand off to the user for squash-merge once `pr-reviewer` returns `PASS`.

## What you NEVER do

- ❌ **Never run `gh pr merge`.** The user owns merges (four-eyes principle,
  see `CLAUDE.md` → "Who merges").
- ❌ **Never start an `Opus-worth` task** (architecture-level decisions,
  hard debugging, multi-system design). Hand back to user with a
  `stop_reason`.
- ❌ **Never skip `pr-reviewer`** on a non-docs PR, even if the diff "looks
  obviously fine".

## Picking up Haiku's work (review flow)

When baton points you here for review:

1. `git fetch && git checkout <branch>` (the PR branch Haiku opened).
2. Invoke `pr-reviewer` subagent with the PR number.
3. If `CHANGES REQUESTED` or `BLOCK`: apply fixes, commit, push, wait for
   CI, re-invoke `pr-reviewer`. Loop.
4. When `PASS`: update baton with:
   - `to: user`
   - `next: squash-merge PR #N en la UI de GitHub, luego HANDOFF a Haiku
para cleanup`
   - `stop_reason: pr-reviewer PASS — merge is the user's call`
5. End your turn with:

   > ✅ **PR #N listo para squash-merge.**
   > `pr-reviewer` verdict: PASS. Merge desde la UI de GitHub.
   > Después vuelve a la terminal de **Haiku** para el cleanup.

## Picking up a feature task

For `Sonnet-fit` features: standard PR flow. Open the PR, wait for CI green,
then run `pr-reviewer` yourself (you don't need to hand off — you're already
in the right lane). Loop until PASS, then hand off to user as above.

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

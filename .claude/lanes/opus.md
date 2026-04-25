# Opus lane — architecture and hard problems

You are running in the **Opus terminal**. Reserved for the work that
genuinely benefits from the most capable model.

## What you DO

- Architecture decisions: data model changes, auth patterns, multi-system
  refactors, picking between competing approaches.
- Hard debugging: bugs that survived a Sonnet pass, intermittent failures,
  cross-cutting concerns.
- Process design: refining the multi-terminal protocol, writing/updating
  lane files, designing the backlog cycle structure.
- Reviewing Sonnet's work when the user wants a third opinion before
  shipping something risky.

## What you NEVER do

- ❌ **Never burn the Opus budget on mechanical work** that Haiku or Sonnet
  could do. If the baton hands you a `Haiku-fit` or simple `Sonnet-fit`
  task, write a `stop_reason: out of lane — wrong model for this work` and
  hand it back.
- ❌ **Never run `gh pr merge`.** Same rule as everyone else.

## Handoff format

When you finish a turn, end with the standard format:

> 🛑 **PARADA — cambia a la terminal de [Sonnet|Haiku].**
> [una línea explicando qué queda pendiente]

Or, if the work is genuinely done and the user can take it from here:

> ✅ **LISTO** — [resumen en una línea].

Always update `.private/baton.md` before ending the turn.

@AGENTS.md

# LookThisOne — Guía para agentes de IA

Este archivo se carga automáticamente en cada sesión de Claude Code (y otros
agentes compatibles). Documenta el **cómo trabajar** en este repo: workflow,
arquitectura, convenciones y restricciones.

Para el pitch del producto y el setup local, leé `README.md`.

---

## Qué es el proyecto

**LookThisOne** — link-in-bio SaaS (competidor de Linktree/Beacons).
Dominio objetivo: `lookthis.one`.
El repo es **público** y sirve también como portafolio del desarrollador.

---

## Stack

| Capa          | Tecnología                                     |
| ------------- | ---------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack build)       |
| Lenguaje      | TypeScript                                     |
| Estilos       | Tailwind CSS v4                                |
| Base de datos | PostgreSQL (Supabase)                          |
| ORM           | Prisma 7 + driver adapter `@prisma/adapter-pg` |
| Auth          | Supabase Auth (vía `@supabase/ssr`)            |
| Storage       | Supabase Storage                               |
| Hosting       | Vercel (deploy automático desde `main`)        |

---

## Arquitectura

```
Visitante → Vercel CDN → Next.js App Router
                           ├── /[username]       (ISR, revalidate 60s)
                           ├── /dashboard        (SPA privada, auth)
                           └── API Routes
                                 ↓
                         Supabase (Postgres + Auth + Storage)
```

### Modelo de datos

Multi-tenant desde el inicio:

```
users → workspaces → pages → links
                           → themes
                           → analytics_events
```

- `users.id` = `auth.users.id` de Supabase (UUID).
- Un usuario puede pertenecer a varios `workspaces` vía `workspace_members`.
- Cada `workspace` tiene varias `pages`; cada página, varios `links`.
- `analytics_events` está separada; candidata a migrar a ClickHouse/Tinybird
  cuando escale.

### Seguridad

- **RLS activado en todas las tablas** (ver `prisma/migrations/*_rls_policies`).
- Prisma se conecta con el rol `postgres` (superuser) y **omite RLS** — las
  operaciones del servidor funcionan sin restricción.
- El cliente Supabase (browser, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`) **sí**
  está sujeto a RLS. Políticas actuales: lectura pública de páginas publicadas,
  links activos de páginas publicadas y temas; insert anónimo en
  `analytics_events`. El resto queda bloqueado hasta que exista flujo de auth.

---

## Workflow de desarrollo

### Protección de `main`

La rama `main` **está protegida**:

- No se permiten pushes directos.
- Cambios entran por Pull Request.
- El check `Lint, typecheck & build` debe pasar.
- No se permite force-push ni borrado de la rama.
- Historial lineal obligatorio.

### Ciclo por cada cambio

```bash
git checkout main && git pull              # alinearse con remoto
git checkout -b <tipo>/<nombre-kebab>      # crear feature branch
# ... editar, commitear ...
git push -u origin <rama>                  # publicar rama
gh pr create --title "..." --body "..."    # abrir PR
# Esperar CI verde, revisar diff en GitHub
# → el merge lo hace el owner desde la UI de GitHub (ver abajo)
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

### Quién mergea (separación de roles)

El merge a `main` es un **acto de ownership**: marca la entrada de código a
producción y dispara el deploy automático a Vercel. Por eso:

- **Los agentes de IA (Claude Code, etc.) NO ejecutan `gh pr merge`.**
  Su trabajo termina al abrir el PR y confirmar que CI está verde.
- **El owner del repo** revisa el diff en GitHub y hace el squash-merge +
  delete branch desde la UI (o con `gh pr merge --squash --delete-branch`
  ejecutado manualmente).
- Tras el merge, el agente (o el dev) sincroniza: `git checkout main &&
git pull`, borra la rama local, y continúa con el siguiente trabajo.

Esto preserva el _four-eyes principle_ aunque el repo sea de un solo
desarrollador, y evita que acciones irreversibles sobre `main` se ejecuten
sin revisión humana final.

### Convenciones de ramas

| Prefijo  | Para qué                                    |
| -------- | ------------------------------------------- |
| `feat/`  | nueva funcionalidad                         |
| `fix/`   | corrección de bug                           |
| `chore/` | tooling, dependencias, refactor sin feature |
| `docs/`  | solo documentación                          |
| `test/`  | tests                                       |

Ej: `feat/dashboard-login`, `fix/isr-cache-invalidation`, `docs/readme-badges`.

### Commits

Usamos **Conventional Commits** con prefijos: `feat:`, `fix:`, `chore:`,
`docs:`, `test:`, `refactor:`, `perf:`, `style:`, `ci:`.

Ejemplo:

```
feat(dashboard): login con email magic link

Implementa sign-in con Supabase Auth usando OTP por email.
Redirige a /dashboard después del callback.
```

El **squash merge** de cada PR deja un solo commit por feature en `main` — el
`git log` se lee como una timeline de features.

### Pre-commit automático

`husky` + `lint-staged` corren en cada `git commit`:

- ESLint (`--fix`) y Prettier (`--write`) sobre archivos staged.
- Si lint/format falla, el commit se aborta. Arreglar y reintentar.

### CI en cada PR

`.github/workflows/ci.yml` corre, en este orden:

1. `npm run format:check`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`

Todos deben pasar antes de mergear.

---

## Comandos útiles

```bash
npm run dev               # Next.js en modo dev
npm run build             # build de producción (genera Prisma + compila Next)
npm run lint              # ESLint
npm run format            # Prettier --write en todo el repo
npm run format:check      # Prettier --check (lo que corre CI)
npm run typecheck         # tsc --noEmit

# Prisma (leen .env.local vía dotenv-cli)
npm run prisma:migrate    # crear/aplicar migración en dev
npm run prisma:deploy     # aplicar migraciones en prod (para CI/Vercel)
npm run prisma:studio     # UI para explorar/editar datos
npm run prisma:generate   # regenerar Prisma Client
```

---

## Convenciones de código

- **Imports absolutos** vía alias `@/` (configurado en `tsconfig.json`).
  Ejemplo: `import { prisma } from '@/lib/prisma'`.
- **Server-first**: usar Server Components y Server Actions por defecto.
  Marcar `'use client'` solo cuando haga falta (interactividad, hooks del browser).
- **Datos públicos (perfiles)**: leer con Prisma desde Server Components
  (bypasea RLS, tipado fuerte, más rápido).
- **Datos del usuario autenticado**: usar Supabase client (respeta RLS, tiene
  la sesión).
- **Imágenes**: preferir `next/image` cuando sea posible; el `<img>` actual en
  `/[username]` es temporal (los avatares vienen de URL externa de Supabase
  Storage y requieren configurar `images.remotePatterns` — pendiente).

---

## Qué NO hacer

- ❌ **No tocar el sitio legacy en Hostinger** (`lookthis.one` actual sirve
  una versión vieja HTML/CSS/JS vanilla — no está en este repo).
- ❌ **No commitear secretos**: `.env*` está en `.gitignore` (excepto
  `.env.example`). Si un secreto aparece en el historial, rotar inmediatamente.
- ❌ **No bypassear RLS desde el cliente**: si necesitás lectura/escritura
  privilegiada desde la UI, pasá por una Server Action o API Route con Prisma.
- ❌ **No pushear a `main`**: ni siquiera con un empty commit. Siempre branch + PR.
- ❌ **No usar `prisma migrate reset` en prod**: borra toda la data.
  Solo en dev local.
- ❌ **No mergear con CI en rojo**: el ruleset lo impide, pero aunque pudieras,
  no.

---

## Infraestructura externa (referencia rápida)

- **GitHub**: `https://github.com/AlejandroPu/LookThisOne`
- **Vercel**: proyecto `look-this-one`, deploy automático desde `main`.
- **Supabase**: proyecto en `gogaohyatpsmtqisiyat.supabase.co` (Free tier).
  Data API activado, RLS automático activado.

Variables de entorno necesarias: ver `.env.example`.

# LookThisOne — Contexto del proyecto para Claude Code

## Qué es el proyecto

Una **link in bio tool** profesional y escalable (similar a Linktree o Beacons). Permite a creadores, artistas y marcas tener una página pública con todos sus links, personalizable y con analytics de clicks.

El dominio final será **LookThis.One** (actualmente apuntando a Hostinger con una versión anterior en HTML/CSS/JS vanilla — no tocar).

---

## Stack tecnológico decidido

| Capa          | Tecnología               | Motivo                                                  |
| ------------- | ------------------------ | ------------------------------------------------------- |
| Framework     | Next.js 15 (App Router)  | SSR/ISR para perfiles públicos, API Routes para backend |
| Hosting       | Vercel (Hobby, gratuito) | Deploy automático desde GitHub, CDN global              |
| Base de datos | PostgreSQL vía Supabase  | Gratuito, incluye auth y storage                        |
| ORM           | Prisma                   | Type-safety, migraciones versionadas                    |
| Autenticación | Supabase Auth            | Incluido en Supabase, evita dependencia extra           |
| Storage       | Supabase Storage         | Avatares y banners, incluido en plan gratuito           |
| Lenguaje      | TypeScript               | Type-safety en todo el proyecto                         |

---

## Arquitectura general

```
usuarios → Next.js (Vercel CDN) → API Routes → PostgreSQL (Supabase)
                                             → Supabase Auth
                                             → Supabase Storage
```

### Perfil público (`/[username]`)

- Renderizado con **ISR (Incremental Static Regeneration)**
- `revalidate: 60` — se regenera máximo una vez por minuto
- El 99% del tráfico se sirve desde el CDN sin tocar la base de datos
- Soporta millones de visitas sin degradar el sistema

### Dashboard (`/dashboard`)

- SPA privada protegida por autenticación
- El creador gestiona sus links, temas y perfil

### Modelo de datos base

```
users → workspaces → pages → links
                           → themes
                           → analytics_events
```

---

## Infraestructura actual (ya configurada)

### GitHub

- Repositorio: `https://github.com/AlejandroPu/LookThisOne`
- Rama principal: `main`
- Estado: tiene solo un `README.md` — el proyecto Next.js aún no existe

### Vercel

- Proyecto: `look-this-one`
- Conectado al repo `AlejandroPu/LookThisOne` rama `main`
- Plan: Hobby (gratuito)
- Preset: Next.js
- Variables de entorno ya configuradas:
  - `NEXT_PUBLIC_SUPABASE_URL` = `https://gogaohyatpsmtqisiyat.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_dLlyJHFcolU2Ti_wx9ilpg_b6NNN9uE`
- Comportamiento: cada `git push` a `main` dispara un deploy automático

### Supabase

- Proyecto: `AlejandroPu's Project`
- URL: `https://gogaohyatpsmtqisiyat.supabase.co`
- Plan: Free
- PostgreSQL tipo: Postgres (default)
- Seguridad configurada:
  - Data API: activado
  - Automatically expose new tables: **desactivado**
  - Automatic RLS: **activado**

---

## Lo que falta hacer (primer paso con Claude Code)

1. **Generar el proyecto Next.js** en el computador local dentro de una carpeta `LookThisOne`
2. **Instalar dependencias**: `next`, `typescript`, `prisma`, `@supabase/supabase-js`, `tailwindcss`
3. **Crear `.env.local`** con las variables de Supabase para desarrollo local
4. **Verificar que `.env.local` esté en `.gitignore`** (Next.js lo hace automáticamente)
5. **Primer `git push`** para que Vercel haga el primer deploy exitoso

---

## Variables de entorno para `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://gogaohyatpsmtqisiyat.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_dLly...
```

> La `PUBLISHABLE_KEY` completa está guardada en Vercel. Cópiala desde Vercel → Settings → Environment Variables antes de crear este archivo.

---

## Decisiones de arquitectura importantes

- **Multi-tenancy desde el inicio**: incluir tabla `workspaces` entre `users` y `pages` para soportar plan Teams/Agency en el futuro
- **Separar DB transaccional y analítica**: los clicks van a una tabla separada, en el futuro migrar a Tinybird/ClickHouse
- **Dominios personalizados**: cada usuario puede tener `username.lookthis.one` o su propio dominio
- **RLS activado en todas las tablas**: cada usuario solo puede leer/escribir sus propios datos
- **ISR agresivo en perfiles públicos**: `revalidate: 60` como mínimo

---

## Contexto del desarrollador

- Sistema operativo: Windows 11 (HP Pavilion)
- Herramienta de desarrollo: Claude Code
- Nivel: aprendiendo, prefiere explicaciones claras paso a paso
- Objetivo: producto empresarial de largo plazo, comenzando con servicios gratuitos

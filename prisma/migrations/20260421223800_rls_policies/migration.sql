-- Habilita Row Level Security en todas las tablas.
-- Prisma se conecta con el rol `postgres` (superuser) y omite RLS,
-- así que las operaciones desde el servidor siguen funcionando.
-- RLS solo afecta al cliente de Supabase (anon / authenticated).

ALTER TABLE "users"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workspaces"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workspace_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pages"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "links"             ENABLE ROW LEVEL SECURITY;
ALTER TABLE "themes"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "analytics_events"  ENABLE ROW LEVEL SECURITY;

-- ===== Lectura pública =====
-- Cualquiera puede leer páginas publicadas (perfiles públicos).
CREATE POLICY "Public read published pages"
  ON "pages"
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Cualquiera puede leer links activos que pertenezcan a una página publicada.
CREATE POLICY "Public read enabled links of published pages"
  ON "links"
  FOR SELECT
  TO anon, authenticated
  USING (
    enabled = true
    AND EXISTS (
      SELECT 1 FROM "pages" p
      WHERE p.id = "links".page_id
        AND p.published = true
    )
  );

-- Los temas (built-in) son públicos para que las páginas puedan renderizarlos.
CREATE POLICY "Public read themes"
  ON "themes"
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- ===== Inserts anónimos de analítica =====
-- El cliente público puede registrar eventos (views/clicks) sin estar autenticado.
-- Solo INSERT; no lectura.
CREATE POLICY "Anyone can insert analytics events"
  ON "analytics_events"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- El resto de las tablas (users, workspaces, workspace_members) quedan con RLS
-- habilitado y sin políticas: el cliente anon/authenticated no puede acceder.
-- Se añadirán políticas cuando construyamos el dashboard autenticado.

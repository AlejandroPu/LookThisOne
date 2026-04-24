INSERT INTO "themes" ("id", "name", "is_built_in", "background", "foreground", "accent")
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Midnight', true, '#0b0b0f', '#ffffff', '#6366f1'),
  ('00000000-0000-0000-0000-000000000002', 'Ivory',    true, '#f9f9f7', '#18181b', '#f43f5e'),
  ('00000000-0000-0000-0000-000000000003', 'Ocean',    true, '#0c4a6e', '#e0f2fe', '#22d3ee'),
  ('00000000-0000-0000-0000-000000000004', 'Sunset',   true, '#431407', '#fff7ed', '#fb923c')
ON CONFLICT ("id") DO NOTHING;

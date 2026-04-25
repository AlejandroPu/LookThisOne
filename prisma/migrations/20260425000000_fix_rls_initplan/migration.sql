-- Wrap auth.uid() in (select ...) so Postgres evaluates it once per query
-- instead of once per row. Fixes the auth_rls_initplan advisor warning.
DROP POLICY IF EXISTS "Users can read own row" ON "users";

CREATE POLICY "Users can read own row"
  ON "users"
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

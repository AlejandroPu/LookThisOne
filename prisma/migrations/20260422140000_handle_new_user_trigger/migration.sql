-- Sync auth.users into public.users on signup.
--
-- Supabase stores auth identities in auth.users. Our application schema keeps
-- a mirror row in public.users so that foreign keys (workspace_members.user_id,
-- etc.) can reference it. This trigger keeps the two in sync atomically: any
-- successful signup in auth.users produces a matching public.users row.
--
-- The function runs with SECURITY DEFINER so it can write into public.users
-- regardless of the caller (Supabase Auth uses the "supabase_auth_admin" role).
-- search_path is pinned to avoid function-hijack via mutable search_path.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at, updated_at)
  VALUES (NEW.id, NEW.email, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Allow authenticated users to read their own public.users row.
-- Writes stay blocked — profile updates will go through Server Actions with Prisma.
CREATE POLICY "Users can read own row"
  ON "users"
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

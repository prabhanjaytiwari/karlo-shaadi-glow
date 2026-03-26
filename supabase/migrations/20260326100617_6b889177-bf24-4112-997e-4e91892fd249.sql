CREATE OR REPLACE FUNCTION public.get_user_email(uid uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = uid;
$$;
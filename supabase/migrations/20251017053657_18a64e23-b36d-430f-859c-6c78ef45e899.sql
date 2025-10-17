-- Update the handle_new_user function to also assign a default 'couple' role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'phone'
  );
  
  -- Assign default 'couple' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'couple');
  
  RETURN new;
END;
$$;
-- Update handle_new_user to check for vendor signup and assign correct role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'phone'
  );
  
  -- Check if user is signing up as vendor (has business_name in metadata)
  IF new.raw_user_meta_data->>'business_name' IS NOT NULL THEN
    user_role := 'vendor';
  ELSE
    user_role := 'couple';
  END IF;
  
  -- Insert the appropriate role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role);
  
  RETURN new;
END;
$function$;
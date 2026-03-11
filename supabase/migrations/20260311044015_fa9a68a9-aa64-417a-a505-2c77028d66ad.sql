
-- Step 1: Alter referred_by from uuid to text
ALTER TABLE public.profiles ALTER COLUMN referred_by TYPE text USING referred_by::text;

-- Step 2: Update handle_new_user to copy referred_by from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Insert profile with referred_by from metadata
  INSERT INTO public.profiles (id, full_name, phone, referred_by)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'referred_by'
  );
  
  -- Check if user is signing up as vendor
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
$$;

-- Step 3: Recreate process_referral_signup trigger on profiles
-- (The trigger function already exists and is correct, but triggers were missing)
DROP TRIGGER IF EXISTS trigger_process_referral ON public.profiles;
CREATE TRIGGER trigger_process_referral
  BEFORE INSERT OR UPDATE OF referred_by ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_signup();

-- Step 4: Recreate referral reward trigger on bookings
DROP TRIGGER IF EXISTS trigger_referral_reward ON public.bookings;
CREATE TRIGGER trigger_referral_reward
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_reward();

-- Step 5: Recreate milestone check trigger on referrals
DROP TRIGGER IF EXISTS trigger_check_milestones ON public.referrals;
CREATE TRIGGER trigger_check_milestones
  AFTER UPDATE ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.check_referral_milestones();

-- Step 6: Recreate referral code generation trigger
DROP TRIGGER IF EXISTS trigger_generate_referral_code ON public.profiles;
CREATE TRIGGER trigger_generate_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION public.generate_referral_code();

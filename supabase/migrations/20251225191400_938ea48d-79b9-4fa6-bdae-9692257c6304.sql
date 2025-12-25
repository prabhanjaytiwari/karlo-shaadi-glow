-- PERMANENTLY FIX: Drop ALL triggers and functions using app.settings.supabase_url

-- 1. Drop the welcome email trigger on profiles (the root cause)
DROP TRIGGER IF EXISTS on_profile_created_send_welcome ON public.profiles;

-- 2. Drop ALL problematic functions that use app.settings configuration
DROP FUNCTION IF EXISTS public.trigger_welcome_email() CASCADE;
DROP FUNCTION IF EXISTS public.notify_booking_created() CASCADE;
DROP FUNCTION IF EXISTS public.notify_booking_updated() CASCADE;
DROP FUNCTION IF EXISTS public.notify_review_created() CASCADE;
DROP FUNCTION IF EXISTS public.notify_message_created() CASCADE;
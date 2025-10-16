-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS partner_name text,
ADD COLUMN IF NOT EXISTS venue_city text,
ADD COLUMN IF NOT EXISTS guest_count integer,
ADD COLUMN IF NOT EXISTS preferred_season text;

-- Add a check constraint for preferred_season to ensure valid values
ALTER TABLE public.profiles 
ADD CONSTRAINT check_preferred_season 
CHECK (preferred_season IS NULL OR preferred_season IN ('winter', 'spring', 'summer', 'monsoon', 'autumn'));

COMMENT ON COLUMN public.profiles.partner_name IS 'Name of the user''s partner/spouse';
COMMENT ON COLUMN public.profiles.venue_city IS 'City where the wedding will be held';
COMMENT ON COLUMN public.profiles.guest_count IS 'Expected number of guests at the wedding';
COMMENT ON COLUMN public.profiles.preferred_season IS 'Preferred season for the wedding (winter, spring, summer, monsoon, autumn)';
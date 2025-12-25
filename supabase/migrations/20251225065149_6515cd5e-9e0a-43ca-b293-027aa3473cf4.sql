-- Phase 1: Ensure referral code generation trigger exists on profiles
-- (The function already exists, but we need to ensure the trigger is attached)

-- Drop trigger if exists and recreate to ensure it's attached
DROP TRIGGER IF EXISTS trigger_generate_referral_code ON public.profiles;

CREATE TRIGGER trigger_generate_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_referral_code();

-- Phase 1.3: Create function to process referral signup
-- This is called when a new user signs up with a referral code
CREATE OR REPLACE FUNCTION public.process_referral_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referrer_user_id uuid;
  referrer_code text;
BEGIN
  -- Check if the new user was referred (has referred_by set)
  IF NEW.referred_by IS NOT NULL THEN
    -- Find the referrer by referral code
    SELECT id, referral_code INTO referrer_user_id, referrer_code
    FROM public.profiles
    WHERE referral_code = NEW.referred_by;
    
    IF referrer_user_id IS NOT NULL THEN
      -- Create a referral record
      INSERT INTO public.referrals (
        referrer_id,
        referral_code,
        referred_user_id,
        referred_email,
        status,
        reward_amount,
        reward_type
      )
      SELECT 
        referrer_user_id,
        referrer_code,
        NEW.id,
        u.email,
        'pending',
        500,
        'credit'
      FROM auth.users u
      WHERE u.id = NEW.id;
      
      -- Give the referred user a signup bonus credit
      NEW.referral_credits := COALESCE(NEW.referral_credits, 0) + 500;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for referral signup processing
DROP TRIGGER IF EXISTS trigger_process_referral_signup ON public.profiles;

CREATE TRIGGER trigger_process_referral_signup
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_signup();

-- Phase 2: Create function to process referral reward when booking is completed
CREATE OR REPLACE FUNCTION public.process_referral_reward()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referral_record RECORD;
BEGIN
  -- Only process when booking status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Find pending referral for this user
    SELECT r.*, p.referral_credits
    INTO referral_record
    FROM public.referrals r
    JOIN public.profiles p ON p.id = r.referrer_id
    WHERE r.referred_user_id = NEW.couple_id
    AND r.status = 'pending'
    LIMIT 1;
    
    IF referral_record.id IS NOT NULL THEN
      -- Update referral status to rewarded
      UPDATE public.referrals
      SET 
        status = 'rewarded',
        completed_at = NOW(),
        rewarded_at = NOW()
      WHERE id = referral_record.id;
      
      -- Credit the referrer with ₹500
      UPDATE public.profiles
      SET referral_credits = COALESCE(referral_credits, 0) + 500
      WHERE id = referral_record.referrer_id;
      
      -- Create notification for referrer (if notifications table exists)
      INSERT INTO public.notifications (user_id, title, message, type, link)
      VALUES (
        referral_record.referrer_id,
        'Referral Reward Earned! 🎉',
        'You earned ₹500 because your friend completed their first booking!',
        'referral',
        '/referrals'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for referral reward processing
DROP TRIGGER IF EXISTS trigger_process_referral_reward ON public.bookings;

CREATE TRIGGER trigger_process_referral_reward
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.process_referral_reward();

-- Phase 3: Create referral milestones table
CREATE TABLE IF NOT EXISTS public.referral_milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_count integer NOT NULL,
  reward_type text NOT NULL, -- 'credit', 'badge', 'premium_access'
  reward_value integer NOT NULL DEFAULT 0, -- Amount for credits
  badge_name text, -- For badge rewards
  badge_icon text, -- Icon for badge
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referral_milestones ENABLE ROW LEVEL SECURITY;

-- Allow all users to read milestones (they're public)
CREATE POLICY "Anyone can view referral milestones"
  ON public.referral_milestones
  FOR SELECT
  USING (true);

-- Insert default milestones
INSERT INTO public.referral_milestones (referral_count, reward_type, reward_value, badge_name, badge_icon, description)
VALUES 
  (1, 'credit', 500, 'First Referral', '🌟', 'Earn ₹500 credit for your first successful referral'),
  (3, 'badge', 2000, 'Social Shaadi', '🎊', 'Earn ₹2,000 credit + Social Shaadi badge'),
  (5, 'premium_access', 0, 'Wedding Networker', '💫', 'Get free Priority Listing for 1 month'),
  (10, 'credit', 10000, 'Wedding Influencer', '👑', 'Earn ₹10,000 credit + Wedding Influencer badge'),
  (25, 'premium_access', 0, 'Shaadi Ambassador', '🏆', 'Get Premium Dashboard access (lifetime)')
ON CONFLICT DO NOTHING;

-- Create user referral milestones tracking table
CREATE TABLE IF NOT EXISTS public.user_referral_milestones (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  milestone_id uuid NOT NULL REFERENCES public.referral_milestones(id),
  achieved_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, milestone_id)
);

-- Enable RLS
ALTER TABLE public.user_referral_milestones ENABLE ROW LEVEL SECURITY;

-- Users can view their own milestones
CREATE POLICY "Users can view their own referral milestones"
  ON public.user_referral_milestones
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own milestones
CREATE POLICY "Users can claim their own referral milestones"
  ON public.user_referral_milestones
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to check and award milestones
CREATE OR REPLACE FUNCTION public.check_referral_milestones()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  referral_count integer;
  milestone RECORD;
BEGIN
  -- Count completed referrals for this referrer
  SELECT COUNT(*) INTO referral_count
  FROM public.referrals
  WHERE referrer_id = NEW.referrer_id
  AND status = 'rewarded';
  
  -- Check for new milestones
  FOR milestone IN 
    SELECT m.* 
    FROM public.referral_milestones m
    LEFT JOIN public.user_referral_milestones urm 
      ON urm.milestone_id = m.id AND urm.user_id = NEW.referrer_id
    WHERE m.referral_count <= referral_count
    AND urm.id IS NULL
  LOOP
    -- Award milestone
    INSERT INTO public.user_referral_milestones (user_id, milestone_id)
    VALUES (NEW.referrer_id, milestone.id);
    
    -- If milestone has credit reward, add it
    IF milestone.reward_type = 'credit' AND milestone.reward_value > 0 THEN
      UPDATE public.profiles
      SET referral_credits = COALESCE(referral_credits, 0) + milestone.reward_value
      WHERE id = NEW.referrer_id;
    END IF;
    
    -- Create notification
    INSERT INTO public.notifications (user_id, title, message, type, link)
    VALUES (
      NEW.referrer_id,
      'Milestone Achieved! 🏆',
      'You reached ' || milestone.referral_count || ' referrals: ' || milestone.description,
      'achievement',
      '/referrals'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger for milestone checking
DROP TRIGGER IF EXISTS trigger_check_referral_milestones ON public.referrals;

CREATE TRIGGER trigger_check_referral_milestones
  AFTER UPDATE ON public.referrals
  FOR EACH ROW
  WHEN (NEW.status = 'rewarded' AND OLD.status != 'rewarded')
  EXECUTE FUNCTION public.check_referral_milestones();
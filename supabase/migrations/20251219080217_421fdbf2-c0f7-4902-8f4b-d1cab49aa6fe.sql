-- Create referrals table for tracking referral codes and usage
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL,
  referral_code TEXT NOT NULL UNIQUE,
  referred_user_id UUID,
  referred_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, rewarded
  reward_amount NUMERIC DEFAULT 0,
  reward_type TEXT DEFAULT 'credit', -- credit, discount, cashback
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  rewarded_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster lookups
CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own referrals" 
  ON public.referrals 
  FOR SELECT 
  USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create referrals" 
  ON public.referrals 
  FOR INSERT 
  WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Service role can manage all referrals" 
  ON public.referrals 
  FOR ALL 
  USING (true);

-- Add referral_code to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_credits NUMERIC DEFAULT 0;

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  -- Generate a unique 8-character code based on user id and random string
  LOOP
    code := UPPER(SUBSTRING(MD5(NEW.id::text || random()::text) FROM 1 FOR 8));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  
  NEW.referral_code := code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-generate referral code on profile creation
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();
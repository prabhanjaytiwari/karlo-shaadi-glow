
-- Create lead_referrals table for the public "Earn with Karlo Shaadi" referral form
CREATE TABLE public.lead_referrals (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_name text NOT NULL,
  referrer_phone text NOT NULL,
  referrer_email text,
  referred_name text NOT NULL,
  referred_phone text NOT NULL,
  wedding_month text,
  relation text,
  status text NOT NULL DEFAULT 'submitted',
  user_id uuid,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lead_referrals ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (public form)
CREATE POLICY "Anyone can submit lead referrals"
ON public.lead_referrals
FOR INSERT
WITH CHECK (true);

-- Logged-in users can view their own submissions
CREATE POLICY "Users can view their own lead referrals"
ON public.lead_referrals
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can manage all lead referrals"
ON public.lead_referrals
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

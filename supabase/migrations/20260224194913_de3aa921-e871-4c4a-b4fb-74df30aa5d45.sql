
-- Shaadi Seva Applications table
CREATE TABLE public.shaadi_seva_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  applicant_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  situation TEXT NOT NULL,
  wedding_date DATE,
  estimated_need NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  funded_amount NUMERIC NOT NULL DEFAULT 0
);

ALTER TABLE public.shaadi_seva_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can apply
CREATE POLICY "Anyone can submit seva applications"
  ON public.shaadi_seva_applications FOR INSERT
  WITH CHECK (true);

-- Admins can view all
CREATE POLICY "Admins can view all seva applications"
  ON public.shaadi_seva_applications FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update
CREATE POLICY "Admins can update seva applications"
  ON public.shaadi_seva_applications FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Shaadi Seva Fund table
CREATE TABLE public.shaadi_seva_fund (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id TEXT NOT NULL,
  booking_id UUID,
  source_type TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  seva_amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shaadi_seva_fund ENABLE ROW LEVEL SECURITY;

-- Anyone can view fund (transparency)
CREATE POLICY "Anyone can view seva fund"
  ON public.shaadi_seva_fund FOR SELECT
  USING (true);

-- Only service role / admin can insert
CREATE POLICY "Admins can insert seva fund records"
  ON public.shaadi_seva_fund FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- System insert policy for edge functions
CREATE POLICY "Service role can manage seva fund"
  ON public.shaadi_seva_fund FOR ALL
  USING (true);

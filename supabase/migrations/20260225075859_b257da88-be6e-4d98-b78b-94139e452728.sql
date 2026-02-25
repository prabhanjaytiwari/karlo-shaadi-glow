
-- Couple Quiz Results table (public, no auth required for viral sharing)
CREATE TABLE public.couple_quiz_results (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner1_name text NOT NULL,
  partner2_name text NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,
  score integer NOT NULL DEFAULT 0,
  personality_type text NOT NULL DEFAULT '',
  personality_description text DEFAULT '',
  share_id text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.couple_quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create quiz results" ON public.couple_quiz_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view quiz results" ON public.couple_quiz_results FOR SELECT USING (true);

-- Vendor Check Requests table (for unregistered vendor checks)
CREATE TABLE public.vendor_check_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  search_query text NOT NULL,
  search_type text NOT NULL DEFAULT 'name',
  vendor_found boolean NOT NULL DEFAULT false,
  vendor_id uuid REFERENCES public.vendors(id),
  trust_score integer DEFAULT 0,
  requester_phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.vendor_check_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create check requests" ON public.vendor_check_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view check requests" ON public.vendor_check_requests FOR SELECT USING (true);

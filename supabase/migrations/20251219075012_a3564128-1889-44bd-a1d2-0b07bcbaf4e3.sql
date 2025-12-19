-- Create investor_inquiries table for investor form submissions
CREATE TABLE public.investor_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  investment_range TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.investor_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to submit investor inquiries (public form)
CREATE POLICY "Anyone can submit investor inquiries"
ON public.investor_inquiries
FOR INSERT
WITH CHECK (true);

-- Only admins can view and manage investor inquiries
CREATE POLICY "Admins can manage investor inquiries"
ON public.investor_inquiries
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));
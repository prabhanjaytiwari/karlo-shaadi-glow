CREATE TABLE public.scraped_vendor_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_url TEXT NOT NULL UNIQUE,
  source_platform TEXT NOT NULL DEFAULT 'web_search',
  business_name TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  raw_data JSONB,
  status TEXT NOT NULL DEFAULT 'new',
  outreach_sent_at TIMESTAMPTZ,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.scraped_vendor_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage scraped leads"
ON public.scraped_vendor_leads
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_scraped_leads_city ON public.scraped_vendor_leads(city);
CREATE INDEX idx_scraped_leads_status ON public.scraped_vendor_leads(status);
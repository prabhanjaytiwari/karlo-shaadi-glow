CREATE TABLE public.vendor_mini_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  theme text NOT NULL DEFAULT 'elegant-rose',
  is_published boolean NOT NULL DEFAULT false,
  sections_config jsonb NOT NULL DEFAULT '{"about": true, "portfolio": true, "services": true, "reviews": true, "whatsapp_cta": true}'::jsonb,
  custom_tagline text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(vendor_id)
);

ALTER TABLE public.vendor_mini_sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage own mini site"
ON public.vendor_mini_sites FOR ALL
USING (vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid()));

CREATE POLICY "Anyone can view published mini sites"
ON public.vendor_mini_sites FOR SELECT
USING (is_published = true);

CREATE TRIGGER update_vendor_mini_sites_updated_at
  BEFORE UPDATE ON public.vendor_mini_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
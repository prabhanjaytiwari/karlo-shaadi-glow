-- Add new columns to vendors table for enhanced verification
ALTER TABLE public.vendors
ADD COLUMN IF NOT EXISTS google_maps_link TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS facebook_page TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS verification_status TEXT DEFAULT 'pending';

-- Create vendor-logos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-logos', 'vendor-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for vendor-logos bucket
CREATE POLICY "Vendor logos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'vendor-logos');

CREATE POLICY "Vendors can upload their own logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vendor-logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can update their own logo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'vendor-logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can delete their own logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vendor-logos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
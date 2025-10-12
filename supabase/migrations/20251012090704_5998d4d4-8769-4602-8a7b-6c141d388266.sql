-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, vendor_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can view their own favorites
CREATE POLICY "Users can view their favorites"
ON public.favorites
FOR SELECT
USING (auth.uid() = user_id);

-- Users can add their own favorites
CREATE POLICY "Users can add favorites"
ON public.favorites
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can remove their own favorites
CREATE POLICY "Users can remove favorites"
ON public.favorites
FOR DELETE
USING (auth.uid() = user_id);

-- Create storage bucket for vendor portfolio
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'vendor-portfolio',
  'vendor-portfolio',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Storage policies for vendor portfolio
CREATE POLICY "Anyone can view portfolio images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vendor-portfolio');

CREATE POLICY "Vendors can upload their portfolio images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'vendor-portfolio' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can update their portfolio images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'vendor-portfolio' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Vendors can delete their portfolio images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'vendor-portfolio' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Add seed data for cities
INSERT INTO public.cities (name, state, is_active) VALUES
('Mumbai', 'Maharashtra', true),
('Delhi', 'Delhi', true),
('Bangalore', 'Karnataka', true),
('Hyderabad', 'Telangana', true),
('Chennai', 'Tamil Nadu', true),
('Kolkata', 'West Bengal', true),
('Pune', 'Maharashtra', true),
('Jaipur', 'Rajasthan', true),
('Ahmedabad', 'Gujarat', true),
('Lucknow', 'Uttar Pradesh', true)
ON CONFLICT DO NOTHING;
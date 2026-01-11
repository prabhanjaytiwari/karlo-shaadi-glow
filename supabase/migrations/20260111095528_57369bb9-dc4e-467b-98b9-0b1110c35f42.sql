-- Add new columns to wedding_websites table
ALTER TABLE public.wedding_websites
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS upi_id TEXT,
ADD COLUMN IF NOT EXISTS bride_parents TEXT,
ADD COLUMN IF NOT EXISTS groom_parents TEXT,
ADD COLUMN IF NOT EXISTS bride_photo_url TEXT,
ADD COLUMN IF NOT EXISTS groom_photo_url TEXT;

-- Create wedding_events table for multiple events
CREATE TABLE IF NOT EXISTS public.wedding_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.wedding_websites(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  event_date DATE,
  event_time TIME,
  venue_name TEXT,
  venue_address TEXT,
  dress_code TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on wedding_events
ALTER TABLE public.wedding_events ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can manage their events
CREATE POLICY "Owners can manage their wedding events"
ON public.wedding_events
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE public.wedding_websites.id = public.wedding_events.website_id 
    AND public.wedding_websites.user_id = auth.uid()
  )
);

-- Policy: Anyone can view events of published websites
CREATE POLICY "Anyone can view events of published websites"
ON public.wedding_events
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE public.wedding_websites.id = public.wedding_events.website_id 
    AND public.wedding_websites.is_published = true
  )
);

-- Create wedding_gallery table for photos
CREATE TABLE IF NOT EXISTS public.wedding_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  website_id UUID NOT NULL REFERENCES public.wedding_websites(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on wedding_gallery
ALTER TABLE public.wedding_gallery ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can manage their gallery
CREATE POLICY "Owners can manage their wedding gallery"
ON public.wedding_gallery
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE public.wedding_websites.id = public.wedding_gallery.website_id 
    AND public.wedding_websites.user_id = auth.uid()
  )
);

-- Policy: Anyone can view gallery of published websites
CREATE POLICY "Anyone can view gallery of published websites"
ON public.wedding_gallery
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE public.wedding_websites.id = public.wedding_gallery.website_id 
    AND public.wedding_websites.is_published = true
  )
);

-- Create storage bucket for wedding images
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-images', 'wedding-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can view wedding images
CREATE POLICY "Anyone can view wedding images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'wedding-images');

-- Storage policy: Authenticated users can upload wedding images
CREATE POLICY "Authenticated users can upload wedding images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'wedding-images' AND auth.uid() IS NOT NULL);

-- Storage policy: Users can update their own wedding images
CREATE POLICY "Users can update their own wedding images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'wedding-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policy: Users can delete their own wedding images
CREATE POLICY "Users can delete their own wedding images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'wedding-images' AND auth.uid()::text = (storage.foldername(name))[1]);
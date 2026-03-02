
-- Create public storage bucket for home banner images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('home-banners', 'home-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Home banners are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'home-banners');

-- Allow service role to upload (edge functions use service role)
CREATE POLICY "Service role can upload home banners"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'home-banners');

CREATE POLICY "Service role can update home banners"
ON storage.objects FOR UPDATE
USING (bucket_id = 'home-banners');

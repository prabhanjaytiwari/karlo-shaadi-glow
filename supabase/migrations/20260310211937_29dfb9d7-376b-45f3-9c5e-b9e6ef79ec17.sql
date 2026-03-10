
INSERT INTO storage.buckets (id, name, public)
VALUES ('family-frame', 'family-frame', true);

CREATE POLICY "Anyone can upload family frame images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'family-frame');

CREATE POLICY "Anyone can view family frame images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'family-frame');

-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('review-photos', 'review-photos', true);

-- Add photos column to reviews table
ALTER TABLE public.reviews
ADD COLUMN photos TEXT[] DEFAULT '{}';

-- Create RLS policies for review photos storage
CREATE POLICY "Anyone can view review photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'review-photos');

CREATE POLICY "Authenticated users can upload review photos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'review-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own review photos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'review-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
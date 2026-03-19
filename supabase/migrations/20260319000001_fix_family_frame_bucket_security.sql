-- Fix family-frame storage bucket security:
-- 1. Remove anonymous upload access
-- 2. Add 5MB file size limit and restrict to image types

-- Drop the existing overly-permissive upload policy
DROP POLICY IF EXISTS "Anyone can upload family frame images" ON storage.objects;

-- Restrict upload to authenticated users only, with 5MB size limit
CREATE POLICY "Authenticated users can upload family frame images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'family-frame'
  AND octet_length(encode(name::bytea, 'hex')) / 2 < 5242880
);

-- Keep public read access (images are meant to be shared/displayed)
-- The existing SELECT policy is fine as-is

-- Update bucket metadata: set file size limit and restrict MIME types
UPDATE storage.buckets
SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
WHERE id = 'family-frame';

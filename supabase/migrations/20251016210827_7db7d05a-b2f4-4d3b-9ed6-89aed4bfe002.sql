-- Create storage bucket for booking documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'booking-documents',
  'booking-documents',
  false,
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
);

-- RLS policies for booking-documents bucket
CREATE POLICY "Couples can view their booking documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'booking-documents' AND
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id::text = (storage.foldername(name))[1]
    AND bookings.couple_id = auth.uid()
  )
);

CREATE POLICY "Vendors can view their booking documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'booking-documents' AND
  EXISTS (
    SELECT 1 FROM bookings
    JOIN vendors ON vendors.id = bookings.vendor_id
    WHERE bookings.id::text = (storage.foldername(name))[1]
    AND vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Couples can upload to their booking documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'booking-documents' AND
  EXISTS (
    SELECT 1 FROM bookings
    WHERE bookings.id::text = (storage.foldername(name))[1]
    AND bookings.couple_id = auth.uid()
  )
);

CREATE POLICY "Vendors can upload to their booking documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'booking-documents' AND
  EXISTS (
    SELECT 1 FROM bookings
    JOIN vendors ON vendors.id = bookings.vendor_id
    WHERE bookings.id::text = (storage.foldername(name))[1]
    AND vendors.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own uploaded documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'booking-documents' AND
  auth.uid()::text = (storage.foldername(name))[2]
);
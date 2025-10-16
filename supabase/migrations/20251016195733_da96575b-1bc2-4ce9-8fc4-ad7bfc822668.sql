-- Create analytics events table
CREATE TABLE public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  vendor_id uuid REFERENCES public.vendors(id) ON DELETE CASCADE,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for analytics performance
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_vendor ON public.analytics_events(vendor_id);
CREATE INDEX idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events(created_at);

-- Enable RLS
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Analytics are viewable by admins only
CREATE POLICY "Admins can view all analytics"
ON public.analytics_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can insert analytics (for tracking)
CREATE POLICY "Anyone can track events"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Create contact inquiries table
CREATE TABLE public.contact_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- Create index for status filtering
CREATE INDEX idx_contact_inquiries_status ON public.contact_inquiries(status);

-- Enable RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Admins can manage contact inquiries
CREATE POLICY "Admins can manage inquiries"
ON public.contact_inquiries
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can create contact inquiries
CREATE POLICY "Anyone can create inquiries"
ON public.contact_inquiries
FOR INSERT
WITH CHECK (true);

-- Create booking documents table
CREATE TABLE public.booking_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  document_type text NOT NULL CHECK (document_type IN ('contract', 'invoice', 'receipt', 'other')),
  file_url text NOT NULL,
  uploaded_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create index for booking lookups
CREATE INDEX idx_booking_documents_booking ON public.booking_documents(booking_id);

-- Enable RLS
ALTER TABLE public.booking_documents ENABLE ROW LEVEL SECURITY;

-- Couples can view their booking documents
CREATE POLICY "Couples can view their documents"
ON public.booking_documents
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = booking_documents.booking_id
    AND bookings.couple_id = auth.uid()
  )
);

-- Vendors can view and upload documents for their bookings
CREATE POLICY "Vendors can manage their booking documents"
ON public.booking_documents
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.bookings
    JOIN public.vendors ON vendors.id = bookings.vendor_id
    WHERE bookings.id = booking_documents.booking_id
    AND vendors.user_id = auth.uid()
  )
);

-- Couples can upload documents to their bookings
CREATE POLICY "Couples can upload documents"
ON public.booking_documents
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookings
    WHERE bookings.id = booking_documents.booking_id
    AND bookings.couple_id = auth.uid()
  )
  AND uploaded_by = auth.uid()
);
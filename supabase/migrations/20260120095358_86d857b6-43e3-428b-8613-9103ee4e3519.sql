-- Add starting price and gender preference to vendors table
ALTER TABLE public.vendors 
ADD COLUMN IF NOT EXISTS starting_price INTEGER,
ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
ADD COLUMN IF NOT EXISTS gender_preference TEXT CHECK (gender_preference IN ('male', 'female', 'any', NULL));

-- Create vendor inquiries table for "Get Quote" feature
CREATE TABLE IF NOT EXISTS public.vendor_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  wedding_date DATE,
  guest_count INTEGER,
  message TEXT,
  budget_range TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_inquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Vendors can see their own inquiries
CREATE POLICY "Vendors can view own inquiries"
ON public.vendor_inquiries
FOR SELECT
USING (
  vendor_id IN (
    SELECT id FROM public.vendors WHERE user_id = auth.uid()
  )
);

-- Policy: Anyone can create inquiry
CREATE POLICY "Anyone can create inquiry"
ON public.vendor_inquiries
FOR INSERT
WITH CHECK (true);

-- Policy: Vendors can update their inquiries
CREATE POLICY "Vendors can update own inquiries"
ON public.vendor_inquiries
FOR UPDATE
USING (
  vendor_id IN (
    SELECT id FROM public.vendors WHERE user_id = auth.uid()
  )
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_vendor_id ON public.vendor_inquiries(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_inquiries_status ON public.vendor_inquiries(status);

-- Add comment for documentation
COMMENT ON TABLE public.vendor_inquiries IS 'Quick quote inquiries from couples to vendors';
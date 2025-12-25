-- Add new values to vendor_category enum
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'social-media-managers';
ALTER TYPE public.vendor_category ADD VALUE IF NOT EXISTS 'makeup';
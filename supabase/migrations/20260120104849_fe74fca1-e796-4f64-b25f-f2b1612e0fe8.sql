-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Add response time tracking to vendors
ALTER TABLE public.vendors ADD COLUMN IF NOT EXISTS avg_response_time_hours NUMERIC;

-- Add video URL to vendor portfolio
ALTER TABLE public.vendor_portfolio ADD COLUMN IF NOT EXISTS video_url TEXT;
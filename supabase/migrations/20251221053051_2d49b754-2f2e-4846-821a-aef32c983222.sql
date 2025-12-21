-- Create wedding_websites table for storing couple's website data
CREATE TABLE public.wedding_websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  couple_names TEXT NOT NULL,
  wedding_date DATE,
  venue_name TEXT,
  venue_address TEXT,
  story TEXT,
  theme TEXT DEFAULT 'royal-gold',
  template TEXT DEFAULT 'classic',
  cover_image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wedding_rsvps table for guest responses
CREATE TABLE public.wedding_rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL REFERENCES public.wedding_websites(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  attending BOOLEAN NOT NULL,
  guest_count INTEGER DEFAULT 1,
  meal_preference TEXT,
  dietary_restrictions TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wedding_websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;

-- RLS policies for wedding_websites
CREATE POLICY "Users can view their own websites" 
ON public.wedding_websites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own websites" 
ON public.wedding_websites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own websites" 
ON public.wedding_websites 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own websites" 
ON public.wedding_websites 
FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Published websites are publicly viewable" 
ON public.wedding_websites 
FOR SELECT 
USING (is_published = true);

-- RLS policies for wedding_rsvps (anyone can submit to published websites)
CREATE POLICY "Anyone can submit RSVP to published websites" 
ON public.wedding_rsvps 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE id = website_id AND is_published = true
  )
);

CREATE POLICY "Website owners can view RSVPs" 
ON public.wedding_rsvps 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.wedding_websites 
    WHERE id = website_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view their own RSVP" 
ON public.wedding_rsvps 
FOR SELECT 
USING (email IS NOT NULL);

-- Create updated_at trigger
CREATE TRIGGER update_wedding_websites_updated_at
BEFORE UPDATE ON public.wedding_websites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for slug lookups
CREATE INDEX idx_wedding_websites_slug ON public.wedding_websites(slug);
CREATE INDEX idx_wedding_rsvps_website_id ON public.wedding_rsvps(website_id);
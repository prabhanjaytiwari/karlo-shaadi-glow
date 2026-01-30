-- Create guest list table
CREATE TABLE public.guest_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  category TEXT DEFAULT 'friends' CHECK (category IN ('family_bride', 'family_groom', 'friends', 'work', 'other')),
  relation TEXT,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'confirmed', 'declined', 'maybe')),
  plus_ones INTEGER DEFAULT 0,
  food_preference TEXT CHECK (food_preference IN ('veg', 'non_veg', 'vegan', 'jain', 'halal', 'no_preference')),
  dietary_notes TEXT,
  table_number INTEGER,
  events TEXT[] DEFAULT '{}',
  notes TEXT,
  invitation_sent BOOLEAN DEFAULT false,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  rsvp_responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.guest_list ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own guests"
ON public.guest_list FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own guests"
ON public.guest_list FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guests"
ON public.guest_list FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guests"
ON public.guest_list FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_guest_list_updated_at
BEFORE UPDATE ON public.guest_list
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
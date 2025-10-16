-- Create wedding_stories table
CREATE TABLE public.wedding_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_names TEXT NOT NULL,
  city_id UUID REFERENCES public.cities(id),
  wedding_date DATE NOT NULL,
  budget_min NUMERIC,
  budget_max NUMERIC,
  guest_count INTEGER,
  theme TEXT NOT NULL,
  cover_image_url TEXT,
  quote TEXT NOT NULL,
  story_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  submitted_by UUID REFERENCES auth.users(id),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Create story_photos table for photo galleries
CREATE TABLE public.story_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.wedding_stories(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create story_vendors table to link stories with vendors
CREATE TABLE public.story_vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.wedding_stories(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, vendor_id)
);

-- Create story_budget_breakdown table
CREATE TABLE public.story_budget_breakdown (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.wedding_stories(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  percentage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create story_timeline table
CREATE TABLE public.story_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.wedding_stories(id) ON DELETE CASCADE,
  phase TEXT NOT NULL,
  description TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wedding_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_budget_breakdown ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_timeline ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wedding_stories
CREATE POLICY "Anyone can view approved stories"
ON public.wedding_stories
FOR SELECT
USING (status = 'approved');

CREATE POLICY "Users can submit their own stories"
ON public.wedding_stories
FOR INSERT
WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their pending stories"
ON public.wedding_stories
FOR UPDATE
USING (auth.uid() = submitted_by AND status = 'pending');

CREATE POLICY "Admins can manage all stories"
ON public.wedding_stories
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for story_photos
CREATE POLICY "Anyone can view photos of approved stories"
ON public.story_photos
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.wedding_stories
  WHERE id = story_photos.story_id AND status = 'approved'
));

CREATE POLICY "Users can manage photos of their stories"
ON public.story_photos
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.wedding_stories
  WHERE id = story_photos.story_id AND submitted_by = auth.uid()
));

CREATE POLICY "Admins can manage all story photos"
ON public.story_photos
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for story_vendors
CREATE POLICY "Anyone can view vendors of approved stories"
ON public.story_vendors
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.wedding_stories
  WHERE id = story_vendors.story_id AND status = 'approved'
));

CREATE POLICY "Users can manage vendors of their stories"
ON public.story_vendors
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.wedding_stories
  WHERE id = story_vendors.story_id AND submitted_by = auth.uid()
));

CREATE POLICY "Admins can manage all story vendors"
ON public.story_vendors
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for story_budget_breakdown
CREATE POLICY "Anyone can view budget of approved stories"
ON public.story_budget_breakdown
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.wedding_stories
  WHERE id = story_budget_breakdown.story_id AND status = 'approved'
));

CREATE POLICY "Users can manage budget of their stories"
ON public.story_budget_breakdown
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.wedding_stories
  WHERE id = story_budget_breakdown.story_id AND submitted_by = auth.uid()
));

CREATE POLICY "Admins can manage all story budgets"
ON public.story_budget_breakdown
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for story_timeline
CREATE POLICY "Anyone can view timeline of approved stories"
ON public.story_timeline
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.wedding_stories
  WHERE id = story_timeline.story_id AND status = 'approved'
));

CREATE POLICY "Users can manage timeline of their stories"
ON public.story_timeline
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.wedding_stories
  WHERE id = story_timeline.story_id AND submitted_by = auth.uid()
));

CREATE POLICY "Admins can manage all story timelines"
ON public.story_timeline
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create indexes for performance
CREATE INDEX idx_wedding_stories_status ON public.wedding_stories(status);
CREATE INDEX idx_wedding_stories_featured ON public.wedding_stories(featured);
CREATE INDEX idx_wedding_stories_city ON public.wedding_stories(city_id);
CREATE INDEX idx_story_photos_story ON public.story_photos(story_id);
CREATE INDEX idx_story_vendors_story ON public.story_vendors(story_id);
CREATE INDEX idx_story_budget_story ON public.story_budget_breakdown(story_id);
CREATE INDEX idx_story_timeline_story ON public.story_timeline(story_id);

-- Trigger for updated_at
CREATE TRIGGER update_wedding_stories_updated_at
BEFORE UPDATE ON public.wedding_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Create wedding_plans table for storing generated plans
CREATE TABLE public.wedding_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  input_data JSONB NOT NULL,
  plan_output JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  saved_at TIMESTAMP WITH TIME ZONE,
  views INTEGER NOT NULL DEFAULT 0
);

-- Create index for fast plan_id lookups
CREATE INDEX idx_wedding_plans_plan_id ON public.wedding_plans(plan_id);
CREATE INDEX idx_wedding_plans_user_id ON public.wedding_plans(user_id);

-- Enable Row Level Security
ALTER TABLE public.wedding_plans ENABLE ROW LEVEL SECURITY;

-- Anyone can create a plan (no auth required for viral sharing)
CREATE POLICY "Anyone can insert wedding plans" 
ON public.wedding_plans 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Anyone can view any plan (for sharing)
CREATE POLICY "Anyone can view wedding plans" 
ON public.wedding_plans 
FOR SELECT 
TO anon, authenticated
USING (true);

-- Only authenticated users can update their own plans
CREATE POLICY "Users can update their own plans" 
ON public.wedding_plans 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_plan_views(p_plan_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.wedding_plans
  SET views = views + 1
  WHERE plan_id = p_plan_id;
END;
$$;
-- Create wedding checklist items table
CREATE TABLE public.wedding_checklist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_name TEXT NOT NULL,
  category TEXT NOT NULL,
  months_before INTEGER NOT NULL DEFAULT 12,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wedding_checklist_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own checklist items"
ON public.wedding_checklist_items
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklist items"
ON public.wedding_checklist_items
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist items"
ON public.wedding_checklist_items
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist items"
ON public.wedding_checklist_items
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_checklist_user_id ON public.wedding_checklist_items(user_id);
CREATE INDEX idx_checklist_months_before ON public.wedding_checklist_items(months_before);

-- Create trigger for updated_at
CREATE TRIGGER update_wedding_checklist_items_updated_at
BEFORE UPDATE ON public.wedding_checklist_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
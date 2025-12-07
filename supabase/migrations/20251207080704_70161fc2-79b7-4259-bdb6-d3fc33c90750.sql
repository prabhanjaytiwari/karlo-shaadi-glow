-- Create budget allocations table for couples to track spending per category
CREATE TABLE public.budget_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_budget NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  allocated_amount NUMERIC NOT NULL DEFAULT 0,
  spent_amount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, category)
);

-- Enable RLS
ALTER TABLE public.budget_allocations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own budget allocations"
ON public.budget_allocations
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own budget allocations"
ON public.budget_allocations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budget allocations"
ON public.budget_allocations
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budget allocations"
ON public.budget_allocations
FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_budget_allocations_updated_at
BEFORE UPDATE ON public.budget_allocations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
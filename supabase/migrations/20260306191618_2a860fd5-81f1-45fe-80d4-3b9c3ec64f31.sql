
-- Payment schedules for vendors to track client installments
CREATE TABLE public.payment_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  event_date DATE,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  service_description TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Payment schedule milestones (individual installments)
CREATE TABLE public.payment_schedule_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  schedule_id UUID NOT NULL REFERENCES public.payment_schedules(id) ON DELETE CASCADE,
  milestone_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  transaction_id TEXT,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vendor contracts
CREATE TABLE public.vendor_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_phone TEXT,
  client_email TEXT,
  event_date DATE,
  event_type TEXT DEFAULT 'wedding',
  services_description TEXT NOT NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  payment_terms TEXT,
  cancellation_policy TEXT,
  additional_clauses TEXT,
  vendor_signature BOOLEAN DEFAULT false,
  client_accepted BOOLEAN DEFAULT false,
  client_accepted_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'draft',
  template_type TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Message templates for vendor communication automation
CREATE TABLE public.vendor_message_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  template_category TEXT NOT NULL DEFAULT 'general',
  message_body TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add pipeline_stage and lead_score to vendor_inquiries
ALTER TABLE public.vendor_inquiries 
  ADD COLUMN IF NOT EXISTS pipeline_stage TEXT DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS lead_temperature TEXT DEFAULT 'warm',
  ADD COLUMN IF NOT EXISTS last_contacted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS notes_internal TEXT;

-- RLS for payment_schedules
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage own payment schedules"
  ON public.payment_schedules FOR ALL
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));

-- RLS for payment_schedule_milestones
ALTER TABLE public.payment_schedule_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage own milestones"
  ON public.payment_schedule_milestones FOR ALL
  USING (schedule_id IN (
    SELECT ps.id FROM public.payment_schedules ps 
    JOIN public.vendors v ON v.id = ps.vendor_id 
    WHERE v.user_id = auth.uid()
  ));

-- RLS for vendor_contracts
ALTER TABLE public.vendor_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage own contracts"
  ON public.vendor_contracts FOR ALL
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));

-- RLS for vendor_message_templates
ALTER TABLE public.vendor_message_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage own message templates"
  ON public.vendor_message_templates FOR ALL
  USING (vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid()));

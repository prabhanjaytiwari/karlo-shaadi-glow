-- Create notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email_new_booking BOOLEAN DEFAULT true,
  email_booking_status BOOLEAN DEFAULT true,
  email_new_message BOOLEAN DEFAULT true,
  email_review BOOLEAN DEFAULT true,
  email_marketing BOOLEAN DEFAULT false,
  email_referral BOOLEAN DEFAULT true,
  sms_new_booking BOOLEAN DEFAULT true,
  sms_booking_status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own preferences
CREATE POLICY "Users can view own notification preferences"
ON public.notification_preferences FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own notification preferences"
ON public.notification_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own notification preferences"
ON public.notification_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_notification_preferences_updated_at
BEFORE UPDATE ON public.notification_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create vendor_billing_history view for tracking payments
CREATE TABLE public.vendor_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  payment_type TEXT NOT NULL, -- 'subscription', 'featured', 'sponsored'
  status TEXT DEFAULT 'pending',
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  invoice_number TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.vendor_payments ENABLE ROW LEVEL SECURITY;

-- Vendors can view their own payments
CREATE POLICY "Vendors can view own payments"
ON public.vendor_payments FOR SELECT
USING (
  vendor_id IN (SELECT id FROM public.vendors WHERE user_id = auth.uid())
);

-- Admin can view all payments
CREATE POLICY "Admins can view all vendor payments"
ON public.vendor_payments FOR SELECT
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- System can insert payments (via service role)
CREATE POLICY "System can insert payments"
ON public.vendor_payments FOR INSERT
WITH CHECK (true);

-- Create function to trigger welcome email on user signup
CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Call the onboarding-email edge function
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/onboarding-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object(
      'user_id', NEW.id,
      'email', (SELECT email FROM auth.users WHERE id = NEW.id),
      'name', NEW.full_name,
      'user_type', CASE 
        WHEN EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = NEW.id AND role = 'vendor') 
        THEN 'vendor' 
        ELSE 'couple' 
      END
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for welcome email
CREATE TRIGGER on_profile_created_send_welcome
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.trigger_welcome_email();
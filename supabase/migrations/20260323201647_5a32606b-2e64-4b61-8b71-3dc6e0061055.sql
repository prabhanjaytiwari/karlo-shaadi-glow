CREATE TABLE public.payment_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid,
  user_id uuid,
  event_type text NOT NULL,
  razorpay_payment_id text,
  razorpay_subscription_id text,
  razorpay_order_id text,
  plan text,
  amount numeric,
  status text,
  error_message text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all payment logs" ON public.payment_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Vendors can view own payment logs" ON public.payment_logs
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can insert payment logs" ON public.payment_logs
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role full access" ON public.payment_logs
  FOR ALL USING (true);
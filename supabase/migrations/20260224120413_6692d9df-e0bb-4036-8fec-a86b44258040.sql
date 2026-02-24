
CREATE TABLE public.vendor_setup_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  name text NOT NULL,
  phone text NOT NULL,
  business_name text NOT NULL,
  category text NOT NULL,
  city text NOT NULL,
  instagram_handle text,
  notes text,
  razorpay_payment_id text,
  amount numeric NOT NULL DEFAULT 999,
  status text NOT NULL DEFAULT 'paid',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

ALTER TABLE public.vendor_setup_orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (payment verified server-side)
CREATE POLICY "Anyone can submit setup orders"
ON public.vendor_setup_orders
FOR INSERT
WITH CHECK (true);

-- Admins can view all orders
CREATE POLICY "Admins can view all setup orders"
ON public.vendor_setup_orders
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update orders
CREATE POLICY "Admins can update setup orders"
ON public.vendor_setup_orders
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

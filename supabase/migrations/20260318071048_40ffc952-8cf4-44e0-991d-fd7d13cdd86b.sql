
-- Function to auto-assign vendor role when a vendor profile is created
CREATE OR REPLACE FUNCTION public.sync_vendor_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.user_id, 'vendor')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Trigger on vendors insert
CREATE TRIGGER on_vendor_created_sync_role
  AFTER INSERT ON public.vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_vendor_role();

-- Backfill: ensure all existing vendors have the vendor role
INSERT INTO public.user_roles (user_id, role)
SELECT v.user_id, 'vendor'::app_role
FROM public.vendors v
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur
  WHERE ur.user_id = v.user_id AND ur.role = 'vendor'
)
ON CONFLICT (user_id, role) DO NOTHING;

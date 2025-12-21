-- Fix user_roles: Allow users to insert their own role (needed for vendor signup)
CREATE POLICY "Users can insert their own role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Fix vendor_subscriptions: Allow vendors to create their own subscription
CREATE POLICY "Vendors can create their own subscription"
ON public.vendor_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM vendors
    WHERE vendors.id = vendor_subscriptions.vendor_id
    AND vendors.user_id = auth.uid()
  )
);
-- Fix analytics_events RLS to allow anonymous event tracking
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can insert their own events" ON public.analytics_events;
DROP POLICY IF EXISTS "Users can view their own events" ON public.analytics_events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow anonymous event tracking" ON public.analytics_events;

-- Create policy to allow anyone to insert analytics events (anonymous tracking)
CREATE POLICY "Allow public event tracking"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Create policy for viewing - users can see their own events
CREATE POLICY "Users can view own events"
ON public.analytics_events
FOR SELECT
USING (user_id = auth.uid());

-- Admins can view all events
CREATE POLICY "Admins can view all events"
ON public.analytics_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
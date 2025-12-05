-- Allow anyone to insert analytics events (for tracking purposes)
-- Analytics events are write-only from client perspective
CREATE POLICY "Anyone can insert analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (true);

-- Only allow users to read their own analytics events
CREATE POLICY "Users can read their own analytics events"
ON public.analytics_events
FOR SELECT
USING (auth.uid() = user_id);

-- Allow admins to read all analytics events
CREATE POLICY "Admins can read all analytics events"
ON public.analytics_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
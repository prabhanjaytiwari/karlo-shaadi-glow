-- Fix analytics_events RLS policy to allow inserts from authenticated and anonymous users
DROP POLICY IF EXISTS "Anyone can track events" ON analytics_events;

-- Create new policy that properly allows inserts
CREATE POLICY "Allow anonymous analytics tracking"
ON analytics_events
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Ensure grants are in place
GRANT INSERT ON analytics_events TO authenticated, anon;
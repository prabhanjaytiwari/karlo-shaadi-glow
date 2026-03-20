-- Fix: replace hardcoded anon JWT in notify trigger functions with
-- current_setting('app.settings.service_role_key') which is already
-- configured in Supabase → Settings → Vault / App Config.
-- This prevents key rotation from requiring a new migration.

CREATE OR REPLACE FUNCTION public.notify_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  supabase_url text := current_setting('app.settings.supabase_url', true);
  service_key  text := current_setting('app.settings.service_role_key', true);
BEGIN
  IF supabase_url IS NOT NULL AND service_key IS NOT NULL THEN
    PERFORM net.http_post(
      url     := supabase_url || '/functions/v1/notify-booking-created',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body    := jsonb_build_object(
        'record', jsonb_build_object(
          'id',           NEW.id,
          'couple_id',    NEW.couple_id,
          'vendor_id',    NEW.vendor_id,
          'wedding_date', NEW.wedding_date,
          'total_amount', NEW.total_amount,
          'status',       NEW.status
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_message_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  supabase_url text := current_setting('app.settings.supabase_url', true);
  service_key  text := current_setting('app.settings.service_role_key', true);
BEGIN
  IF supabase_url IS NOT NULL AND service_key IS NOT NULL THEN
    PERFORM net.http_post(
      url     := supabase_url || '/functions/v1/notify-message-created',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body    := jsonb_build_object(
        'record', jsonb_build_object(
          'id',           NEW.id,
          'sender_id',    NEW.sender_id,
          'recipient_id', NEW.recipient_id,
          'message',      NEW.message
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_review_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  supabase_url text := current_setting('app.settings.supabase_url', true);
  service_key  text := current_setting('app.settings.service_role_key', true);
BEGIN
  IF supabase_url IS NOT NULL AND service_key IS NOT NULL THEN
    PERFORM net.http_post(
      url     := supabase_url || '/functions/v1/notify-review-created',
      headers := jsonb_build_object(
        'Content-Type',  'application/json',
        'Authorization', 'Bearer ' || service_key
      ),
      body    := jsonb_build_object(
        'record', jsonb_build_object(
          'id',        NEW.id,
          'vendor_id', NEW.vendor_id,
          'couple_id', NEW.couple_id,
          'rating',    NEW.rating,
          'comment',   NEW.comment
        )
      )
    );
  END IF;
  RETURN NEW;
END;
$$;

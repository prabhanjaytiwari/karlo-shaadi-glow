
-- Function to notify on new booking
CREATE OR REPLACE FUNCTION public.notify_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  supabase_url text := current_setting('app.settings.supabase_url', true);
  service_key text := current_setting('app.settings.service_role_key', true);
BEGIN
  PERFORM net.http_post(
    url := 'https://qeutvpwskilkbgynhrai.supabase.co/functions/v1/notify-booking-created',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldXR2cHdza2lsa2JneW5ocmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDA2MzUsImV4cCI6MjA3NTY3NjYzNX0.4S2g5jCrvchS-66t6DzIebp0mLNEovFEjYGAkMW8knw'
    ),
    body := jsonb_build_object(
      'record', jsonb_build_object(
        'id', NEW.id,
        'couple_id', NEW.couple_id,
        'vendor_id', NEW.vendor_id,
        'wedding_date', NEW.wedding_date,
        'total_amount', NEW.total_amount,
        'status', NEW.status
      )
    )
  );
  RETURN NEW;
END;
$$;

-- Function to notify on new message
CREATE OR REPLACE FUNCTION public.notify_message_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://qeutvpwskilkbgynhrai.supabase.co/functions/v1/notify-message-created',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldXR2cHdza2lsa2JneW5ocmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDA2MzUsImV4cCI6MjA3NTY3NjYzNX0.4S2g5jCrvchS-66t6DzIebp0mLNEovFEjYGAkMW8knw'
    ),
    body := jsonb_build_object(
      'record', jsonb_build_object(
        'id', NEW.id,
        'sender_id', NEW.sender_id,
        'recipient_id', NEW.recipient_id,
        'message', NEW.message
      )
    )
  );
  RETURN NEW;
END;
$$;

-- Function to notify on new review
CREATE OR REPLACE FUNCTION public.notify_review_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://qeutvpwskilkbgynhrai.supabase.co/functions/v1/notify-review-created',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFldXR2cHdza2lsa2JneW5ocmFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMDA2MzUsImV4cCI6MjA3NTY3NjYzNX0.4S2g5jCrvchS-66t6DzIebp0mLNEovFEjYGAkMW8knw'
    ),
    body := jsonb_build_object(
      'record', jsonb_build_object(
        'id', NEW.id,
        'vendor_id', NEW.vendor_id,
        'couple_id', NEW.couple_id,
        'rating', NEW.rating,
        'comment', NEW.comment
      )
    )
  );
  RETURN NEW;
END;
$$;

-- Create triggers
CREATE TRIGGER trigger_notify_booking_created
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_booking_created();

CREATE TRIGGER trigger_notify_message_created
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_message_created();

CREATE TRIGGER trigger_notify_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_review_created();

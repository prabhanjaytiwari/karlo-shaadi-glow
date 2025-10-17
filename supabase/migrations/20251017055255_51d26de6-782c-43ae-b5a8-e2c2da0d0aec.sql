-- Fix SECURITY DEFINER functions by adding search_path
-- This prevents potential privilege escalation through schema search path manipulation

-- Update handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'phone'
  );
  
  -- Assign default 'couple' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'couple');
  
  RETURN new;
END;
$function$;

-- Update notify_booking_created function
CREATE OR REPLACE FUNCTION public.notify_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Call edge function via HTTP (will be executed asynchronously)
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/notify-booking-created',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  
  RETURN NEW;
END;
$function$;

-- Update notify_booking_updated function
CREATE OR REPLACE FUNCTION public.notify_booking_updated()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Only trigger if status changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM net.http_post(
      url := current_setting('app.settings.supabase_url') || '/functions/v1/notify-booking-updated',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
      ),
      body := jsonb_build_object(
        'record', row_to_json(NEW),
        'old_record', row_to_json(OLD)
      )
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Update notify_review_created function
CREATE OR REPLACE FUNCTION public.notify_review_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/notify-review-created',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  
  RETURN NEW;
END;
$function$;

-- Update update_vendor_rating function
CREATE OR REPLACE FUNCTION public.update_vendor_rating()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE public.vendors
  SET 
    average_rating = (
      SELECT AVG(rating)::NUMERIC(3,2)
      FROM public.reviews
      WHERE vendor_id = NEW.vendor_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE vendor_id = NEW.vendor_id
    )
  WHERE id = NEW.vendor_id;
  RETURN NEW;
END;
$function$;

-- Update has_role function (already has SET search_path but adding for completeness)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$function$;
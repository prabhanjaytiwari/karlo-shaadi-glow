-- Drop the problematic trigger that's causing signup failures
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- Also drop the notify triggers that use the same pattern
DROP TRIGGER IF EXISTS on_booking_created ON public.bookings;
DROP TRIGGER IF EXISTS on_booking_updated ON public.bookings;
DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
DROP TRIGGER IF EXISTS on_message_created ON public.messages;
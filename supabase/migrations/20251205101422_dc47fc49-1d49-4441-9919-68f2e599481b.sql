
-- Create moodboards table
CREATE TABLE public.moodboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_color TEXT DEFAULT '#D4A574',
  is_public BOOLEAN NOT NULL DEFAULT false,
  share_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create moodboard items table
CREATE TABLE public.moodboard_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  moodboard_id UUID NOT NULL REFERENCES public.moodboards(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('image', 'color', 'note')),
  content TEXT NOT NULL,
  title TEXT,
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  width INTEGER DEFAULT 200,
  height INTEGER DEFAULT 200,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievements definition table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 10,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable RLS
ALTER TABLE public.moodboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moodboard_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for moodboards
CREATE POLICY "Users can view their own moodboards" ON public.moodboards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public moodboards" ON public.moodboards
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can create their own moodboards" ON public.moodboards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own moodboards" ON public.moodboards
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own moodboards" ON public.moodboards
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for moodboard items
CREATE POLICY "Users can view items of their moodboards" ON public.moodboard_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.moodboards WHERE id = moodboard_id AND user_id = auth.uid())
  );

CREATE POLICY "Anyone can view items of public moodboards" ON public.moodboard_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.moodboards WHERE id = moodboard_id AND is_public = true)
  );

CREATE POLICY "Users can manage items of their moodboards" ON public.moodboard_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.moodboards WHERE id = moodboard_id AND user_id = auth.uid())
  );

-- RLS Policies for achievements (anyone can view definitions)
CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

-- RLS Policies for user achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage achievements" ON public.user_achievements
  FOR ALL USING (true);

-- Insert default achievements
INSERT INTO public.achievements (name, description, icon, points, requirement_type, requirement_value) VALUES
  ('First Steps', 'Created your account and started planning', 'sparkles', 10, 'account_created', 1),
  ('Profile Complete', 'Filled out all profile details', 'user-check', 20, 'profile_complete', 1),
  ('First Favorite', 'Saved your first vendor to favorites', 'heart', 15, 'favorites_count', 1),
  ('Vendor Explorer', 'Saved 5 vendors to favorites', 'compass', 25, 'favorites_count', 5),
  ('First Booking', 'Made your first vendor booking', 'calendar-check', 50, 'bookings_count', 1),
  ('Booking Pro', 'Completed 3 vendor bookings', 'trophy', 100, 'bookings_count', 3),
  ('Reviewer', 'Left your first vendor review', 'star', 30, 'reviews_count', 1),
  ('Moodboard Creator', 'Created your first moodboard', 'palette', 20, 'moodboards_count', 1),
  ('Design Visionary', 'Created 3 moodboards', 'sparkles', 40, 'moodboards_count', 3),
  ('Message Starter', 'Sent your first message to a vendor', 'message-circle', 15, 'messages_count', 1),
  ('Social Butterfly', 'Connected with 5 vendors via messages', 'users', 35, 'messages_count', 5),
  ('Early Bird', 'Booked a vendor 6+ months before wedding', 'clock', 50, 'early_booking', 1);

-- Update trigger for moodboards
CREATE TRIGGER update_moodboards_updated_at
  BEFORE UPDATE ON public.moodboards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

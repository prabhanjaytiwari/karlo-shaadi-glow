-- Create table for storing generated wedding songs
CREATE TABLE public.generated_songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  lyrics TEXT,
  prompt TEXT,
  category TEXT NOT NULL,
  style TEXT,
  duration INTEGER DEFAULT 180,
  names JSONB,
  suno_track_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.generated_songs ENABLE ROW LEVEL SECURITY;

-- Users can view their own songs
CREATE POLICY "Users can view their own songs"
ON public.generated_songs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own songs
CREATE POLICY "Users can insert their own songs"
ON public.generated_songs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own songs
CREATE POLICY "Users can delete their own songs"
ON public.generated_songs
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_generated_songs_user_id ON public.generated_songs(user_id);
CREATE INDEX idx_generated_songs_created_at ON public.generated_songs(created_at DESC);
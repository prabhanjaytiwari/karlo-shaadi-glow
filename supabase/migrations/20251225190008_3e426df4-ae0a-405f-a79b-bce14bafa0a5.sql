-- Add new vendor categories
INSERT INTO public.categories (name, slug, description, icon, is_active)
VALUES 
  ('Wedding Social Media Managers', 'social-media-managers', 'Professional social media managers to capture and share your wedding moments live on social platforms', 'Camera', true),
  ('Makeup', 'makeup', 'Professional makeup artists for bridal, groom, and family makeup services', 'Sparkles', true)
ON CONFLICT (slug) DO NOTHING;
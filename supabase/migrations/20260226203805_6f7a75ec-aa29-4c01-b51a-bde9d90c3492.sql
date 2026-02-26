
-- Add new values to vendor_category enum
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'influencer';
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'anchor';
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'content-creator';

-- Add corresponding entries to categories table
INSERT INTO public.categories (name, slug, icon, description, display_order, is_active) VALUES
('Influencers', 'influencer', 'Users', 'Wedding influencers & content creators for social media coverage', 17, true),
('Anchors & Emcees', 'anchor', 'Mic', 'Professional anchors and emcees for your wedding events', 18, true),
('Content Creators', 'content-creator', 'Video', 'Wedding videographers and content creators for reels & shorts', 19, true)
ON CONFLICT DO NOTHING;

-- Add new vendor categories to match competitor offerings
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'makeup';
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'invitations';
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'choreography';
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'transport';
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'jewelry';
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'pandit';
ALTER TYPE vendor_category ADD VALUE IF NOT EXISTS 'entertainment';

-- Insert new category records
INSERT INTO categories (name, slug, icon, description, display_order, is_active)
VALUES 
  ('Bridal Makeup', 'makeup', 'Sparkles', 'Professional bridal makeup artists for your special day', 9, true),
  ('Wedding Invitations', 'invitations', 'Mail', 'Custom wedding cards, e-invites, and stationery', 10, true),
  ('Choreographers', 'choreography', 'Music2', 'Wedding dance choreographers for sangeet and reception', 11, true),
  ('Wedding Transport', 'transport', 'Car', 'Luxury cars, vintage vehicles, and bridal entry transport', 12, true),
  ('Jewelry & Accessories', 'jewelry', 'Gem', 'Bridal jewelry, accessories, and rental services', 13, true),
  ('Pandits & Priests', 'pandit', 'BookOpen', 'Experienced priests for all wedding ceremonies and rituals', 14, true),
  ('Special Entertainment', 'entertainment', 'PartyPopper', 'Fireworks, dhol players, live performers, and more', 15, true)
ON CONFLICT (slug) DO NOTHING;
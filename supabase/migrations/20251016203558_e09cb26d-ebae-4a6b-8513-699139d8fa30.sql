-- Add Vendor Services for all seeded vendors
DO $$
DECLARE
  v RECORD;
BEGIN

-- Add services for VENUE vendors
FOR v IN (SELECT id FROM vendors WHERE category = 'venues' ORDER BY created_at DESC LIMIT 10)
LOOP
  INSERT INTO vendor_services (vendor_id, service_name, description, base_price, price_range_min, price_range_max, is_active) VALUES
  (v.id, 'Full Day Venue Rental', 'Complete venue access with all facilities for the wedding day', 150000, 100000, 300000, true),
  (v.id, 'Accommodation Package', 'Guest room blocks with special wedding rates', 5000, 3000, 15000, true),
  (v.id, 'Decoration & Setup', 'Basic venue decoration and stage setup included', 75000, 50000, 150000, true);
END LOOP;

-- Add services for PHOTOGRAPHY vendors
FOR v IN (SELECT id FROM vendors WHERE category = 'photography' ORDER BY created_at DESC LIMIT 15)
LOOP
  INSERT INTO vendor_services (vendor_id, service_name, description, base_price, price_range_min, price_range_max, is_active) VALUES
  (v.id, 'Full Day Photography', 'Complete wedding day coverage with 2 photographers', 50000, 35000, 100000, true),
  (v.id, 'Cinematic Video', 'Wedding film with drone shots and cinematic editing', 75000, 50000, 150000, true),
  (v.id, 'Pre-Wedding Shoot', 'Outdoor location shoot with costume changes', 30000, 20000, 60000, true),
  (v.id, 'Traditional Album', 'Premium 40-page wedding album with leather binding', 25000, 15000, 50000, true);
END LOOP;

-- Add services for CATERING vendors
FOR v IN (SELECT id FROM vendors WHERE category = 'catering' ORDER BY created_at DESC LIMIT 12)
LOOP
  INSERT INTO vendor_services (vendor_id, service_name, description, base_price, price_range_min, price_range_max, is_active) VALUES
  (v.id, 'Wedding Dinner Buffet', 'Multi-cuisine buffet with live counters (per person)', 1500, 800, 3000, true),
  (v.id, 'Breakfast & Hi-Tea', 'Morning breakfast and evening snacks service (per person)', 500, 300, 1000, true),
  (v.id, 'Welcome Drinks & Mocktails', 'Signature drinks and mocktail bar (per person)', 300, 200, 600, true),
  (v.id, 'Dessert Counter', 'Live dessert counter with variety of sweets (per person)', 400, 250, 800, true);
END LOOP;

-- Add services for DECORATION vendors
FOR v IN (SELECT id FROM vendors WHERE category = 'decoration' ORDER BY created_at DESC LIMIT 12)
LOOP
  INSERT INTO vendor_services (vendor_id, service_name, description, base_price, price_range_min, price_range_max, is_active) VALUES
  (v.id, 'Complete Wedding Decor', 'Full venue decoration including mandap, stage, and reception', 200000, 100000, 500000, true),
  (v.id, 'Mandap Design', 'Traditional or contemporary mandap with floral arrangements', 100000, 50000, 250000, true),
  (v.id, 'Reception Stage', 'Elegant stage setup with backdrop and floral decorations', 75000, 40000, 150000, true),
  (v.id, 'Entrance Decor', 'Grand entrance with floral arches and lighting', 50000, 25000, 100000, true);
END LOOP;

-- Add services for MEHENDI vendors
FOR v IN (SELECT id FROM vendors WHERE category = 'mehendi' ORDER BY created_at DESC LIMIT 10)
LOOP
  INSERT INTO vendor_services (vendor_id, service_name, description, base_price, price_range_min, price_range_max, is_active) VALUES
  (v.id, 'Bridal Mehendi', 'Full arms and legs intricate bridal design', 15000, 8000, 30000, true),
  (v.id, 'Family Mehendi Package', 'Mehendi for 10 family members (simple designs)', 10000, 5000, 20000, true),
  (v.id, 'Guests Mehendi', 'Quick designs for wedding guests (per person)', 500, 300, 1000, true);
END LOOP;

-- Add services for MUSIC vendors
FOR v IN (SELECT id FROM vendors WHERE category = 'music' ORDER BY created_at DESC LIMIT 10)
LOOP
  INSERT INTO vendor_services (vendor_id, service_name, description, base_price, price_range_min, price_range_max, is_active) VALUES
  (v.id, 'Wedding Day Performance', 'Live music performance for ceremony and reception', 75000, 40000, 150000, true),
  (v.id, 'DJ Services', 'Professional DJ with sound and lighting system', 50000, 30000, 100000, true),
  (v.id, 'Sangeet Night Special', 'Complete entertainment package for sangeet function', 60000, 35000, 120000, true);
END LOOP;

-- Add services for CAKE vendors
FOR v IN (SELECT id FROM vendors WHERE category = 'cakes' ORDER BY created_at DESC LIMIT 6)
LOOP
  INSERT INTO vendor_services (vendor_id, service_name, description, base_price, price_range_min, price_range_max, is_active) VALUES
  (v.id, 'Multi-Tier Wedding Cake', '3-tier designer cake (serves 100-150)', 15000, 10000, 40000, true),
  (v.id, 'Cupcake Tower', '100 assorted cupcakes with decorative stand', 8000, 5000, 15000, true),
  (v.id, 'Dessert Table', 'Complete dessert spread with mini cakes and pastries', 25000, 15000, 50000, true);
END LOOP;

-- Add services for PLANNING vendors
FOR v IN (SELECT id FROM vendors WHERE category = 'planning' ORDER BY created_at DESC LIMIT 5)
LOOP
  INSERT INTO vendor_services (vendor_id, service_name, description, base_price, price_range_min, price_range_max, is_active) VALUES
  (v.id, 'Full Wedding Planning', 'Complete planning from venue selection to wedding day coordination', 250000, 150000, 500000, true),
  (v.id, 'Partial Planning Package', 'Vendor coordination and timeline management', 150000, 80000, 300000, true),
  (v.id, 'Day-of Coordination', 'Wedding day management and vendor coordination only', 75000, 40000, 150000, true),
  (v.id, 'Destination Wedding Planning', 'Complete destination wedding management with travel arrangements', 400000, 250000, 800000, true);
END LOOP;

END $$;
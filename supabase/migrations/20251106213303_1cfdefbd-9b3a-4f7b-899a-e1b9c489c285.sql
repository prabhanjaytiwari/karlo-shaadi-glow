-- Populate cities table with major Indian cities
INSERT INTO cities (name, state, is_active) VALUES
  ('Mumbai', 'Maharashtra', true),
  ('Delhi', 'Delhi', true),
  ('Bangalore', 'Karnataka', true),
  ('Hyderabad', 'Telangana', true),
  ('Chennai', 'Tamil Nadu', true),
  ('Kolkata', 'West Bengal', true),
  ('Pune', 'Maharashtra', true),
  ('Ahmedabad', 'Gujarat', true),
  ('Jaipur', 'Rajasthan', true),
  ('Lucknow', 'Uttar Pradesh', true),
  ('Chandigarh', 'Chandigarh', true),
  ('Goa', 'Goa', true),
  ('Udaipur', 'Rajasthan', true),
  ('Agra', 'Uttar Pradesh', true),
  ('Kochi', 'Kerala', true),
  ('Surat', 'Gujarat', true),
  ('Indore', 'Madhya Pradesh', true),
  ('Bhopal', 'Madhya Pradesh', true),
  ('Nagpur', 'Maharashtra', true),
  ('Visakhapatnam', 'Andhra Pradesh', true)
ON CONFLICT DO NOTHING;
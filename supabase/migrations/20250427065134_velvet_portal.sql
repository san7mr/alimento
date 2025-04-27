/*
  # Add more Indian cities

  1. Changes
    - Add more states and cities across India
    - Include major metropolitan areas and popular cities
    - Organize by regions (North, South, East, West)

  2. Data
    - Multiple states with their major cities
    - Covers all regions of India
*/

-- Insert States and Cities
DO $$ 
BEGIN
  -- North India
  INSERT INTO states (name) VALUES 
    ('Delhi'),
    ('Punjab'),
    ('Haryana'),
    ('Uttar Pradesh'),
    ('Rajasthan')
  ON CONFLICT (name) DO NOTHING;

  -- South India (including existing Tamil Nadu)
  INSERT INTO states (name) VALUES 
    ('Karnataka'),
    ('Kerala'),
    ('Andhra Pradesh'),
    ('Telangana')
  ON CONFLICT (name) DO NOTHING;

  -- West India
  INSERT INTO states (name) VALUES 
    ('Maharashtra'),
    ('Gujarat'),
    ('Goa')
  ON CONFLICT (name) DO NOTHING;

  -- East India
  INSERT INTO states (name) VALUES 
    ('West Bengal'),
    ('Odisha'),
    ('Bihar')
  ON CONFLICT (name) DO NOTHING;

  -- North India Cities
  WITH delhi AS (SELECT id FROM states WHERE name = 'Delhi')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM delhi), 'New Delhi'),
    ((SELECT id FROM delhi), 'Delhi NCR')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH punjab AS (SELECT id FROM states WHERE name = 'Punjab')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM punjab), 'Amritsar'),
    ((SELECT id FROM punjab), 'Ludhiana'),
    ((SELECT id FROM punjab), 'Chandigarh'),
    ((SELECT id FROM punjab), 'Jalandhar'),
    ((SELECT id FROM punjab), 'Patiala')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH up AS (SELECT id FROM states WHERE name = 'Uttar Pradesh')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM up), 'Lucknow'),
    ((SELECT id FROM up), 'Kanpur'),
    ((SELECT id FROM up), 'Agra'),
    ((SELECT id FROM up), 'Varanasi'),
    ((SELECT id FROM up), 'Noida'),
    ((SELECT id FROM up), 'Ghaziabad')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH rajasthan AS (SELECT id FROM states WHERE name = 'Rajasthan')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM rajasthan), 'Jaipur'),
    ((SELECT id FROM rajasthan), 'Udaipur'),
    ((SELECT id FROM rajasthan), 'Jodhpur'),
    ((SELECT id FROM rajasthan), 'Ajmer'),
    ((SELECT id FROM rajasthan), 'Kota')
  ON CONFLICT (state_id, name) DO NOTHING;

  -- South India Cities
  WITH karnataka AS (SELECT id FROM states WHERE name = 'Karnataka')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM karnataka), 'Bangalore'),
    ((SELECT id FROM karnataka), 'Mysore'),
    ((SELECT id FROM karnataka), 'Mangalore'),
    ((SELECT id FROM karnataka), 'Hubli'),
    ((SELECT id FROM karnataka), 'Belgaum')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH kerala AS (SELECT id FROM states WHERE name = 'Kerala')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM kerala), 'Thiruvananthapuram'),
    ((SELECT id FROM kerala), 'Kochi'),
    ((SELECT id FROM kerala), 'Kozhikode'),
    ((SELECT id FROM kerala), 'Thrissur'),
    ((SELECT id FROM kerala), 'Kollam')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH ap AS (SELECT id FROM states WHERE name = 'Andhra Pradesh')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM ap), 'Visakhapatnam'),
    ((SELECT id FROM ap), 'Vijayawada'),
    ((SELECT id FROM ap), 'Guntur'),
    ((SELECT id FROM ap), 'Tirupati'),
    ((SELECT id FROM ap), 'Nellore')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH telangana AS (SELECT id FROM states WHERE name = 'Telangana')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM telangana), 'Hyderabad'),
    ((SELECT id FROM telangana), 'Warangal'),
    ((SELECT id FROM telangana), 'Nizamabad'),
    ((SELECT id FROM telangana), 'Karimnagar'),
    ((SELECT id FROM telangana), 'Khammam')
  ON CONFLICT (state_id, name) DO NOTHING;

  -- West India Cities
  WITH maharashtra AS (SELECT id FROM states WHERE name = 'Maharashtra')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM maharashtra), 'Mumbai'),
    ((SELECT id FROM maharashtra), 'Pune'),
    ((SELECT id FROM maharashtra), 'Nagpur'),
    ((SELECT id FROM maharashtra), 'Nashik'),
    ((SELECT id FROM maharashtra), 'Aurangabad'),
    ((SELECT id FROM maharashtra), 'Thane')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH gujarat AS (SELECT id FROM states WHERE name = 'Gujarat')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM gujarat), 'Ahmedabad'),
    ((SELECT id FROM gujarat), 'Surat'),
    ((SELECT id FROM gujarat), 'Vadodara'),
    ((SELECT id FROM gujarat), 'Rajkot'),
    ((SELECT id FROM gujarat), 'Gandhinagar')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH goa AS (SELECT id FROM states WHERE name = 'Goa')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM goa), 'Panaji'),
    ((SELECT id FROM goa), 'Margao'),
    ((SELECT id FROM goa), 'Vasco da Gama'),
    ((SELECT id FROM goa), 'Mapusa'),
    ((SELECT id FROM goa), 'Ponda')
  ON CONFLICT (state_id, name) DO NOTHING;

  -- East India Cities
  WITH wb AS (SELECT id FROM states WHERE name = 'West Bengal')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM wb), 'Kolkata'),
    ((SELECT id FROM wb), 'Howrah'),
    ((SELECT id FROM wb), 'Durgapur'),
    ((SELECT id FROM wb), 'Asansol'),
    ((SELECT id FROM wb), 'Siliguri')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH odisha AS (SELECT id FROM states WHERE name = 'Odisha')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM odisha), 'Bhubaneswar'),
    ((SELECT id FROM odisha), 'Cuttack'),
    ((SELECT id FROM odisha), 'Rourkela'),
    ((SELECT id FROM odisha), 'Berhampur'),
    ((SELECT id FROM odisha), 'Sambalpur')
  ON CONFLICT (state_id, name) DO NOTHING;

  WITH bihar AS (SELECT id FROM states WHERE name = 'Bihar')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM bihar), 'Patna'),
    ((SELECT id FROM bihar), 'Gaya'),
    ((SELECT id FROM bihar), 'Muzaffarpur'),
    ((SELECT id FROM bihar), 'Bhagalpur'),
    ((SELECT id FROM bihar), 'Darbhanga')
  ON CONFLICT (state_id, name) DO NOTHING;

END $$;
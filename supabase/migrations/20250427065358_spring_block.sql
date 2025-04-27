/*
  # Add delivery zones for cities

  1. New Tables
    - `delivery_zones` - Areas within cities for delivery
      - `id` (uuid, primary key)
      - `city_id` (uuid, references cities)
      - `name` (text)
      - `base_delivery_fee` (integer)
      - `min_order_amount` (integer)

  2. Security
    - Enable RLS on delivery_zones table
    - Add policies for authenticated users to view zones
*/

-- Create delivery_zones table
CREATE TABLE IF NOT EXISTS delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid REFERENCES cities(id) NOT NULL,
  name text NOT NULL,
  base_delivery_fee integer NOT NULL DEFAULT 40,
  min_order_amount integer NOT NULL DEFAULT 200,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Delivery zones are viewable by all users"
  ON delivery_zones
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert delivery zones for Chennai
DO $$ 
DECLARE
  chennai_id uuid;
BEGIN
  -- Get Chennai's ID
  SELECT id INTO chennai_id FROM cities WHERE name = 'Chennai';

  -- Insert delivery zones for Chennai
  INSERT INTO delivery_zones (city_id, name, base_delivery_fee, min_order_amount)
  VALUES
    (chennai_id, 'Anna Nagar', 30, 150),
    (chennai_id, 'T Nagar', 30, 150),
    (chennai_id, 'Adyar', 35, 200),
    (chennai_id, 'Velachery', 40, 200),
    (chennai_id, 'Mylapore', 35, 200),
    (chennai_id, 'Porur', 45, 250),
    (chennai_id, 'OMR', 40, 200),
    (chennai_id, 'ECR', 45, 250),
    (chennai_id, 'Tambaram', 50, 300),
    (chennai_id, 'Chromepet', 45, 250),
    (chennai_id, 'KK Nagar', 35, 200),
    (chennai_id, 'Vadapalani', 35, 200)
  ON CONFLICT DO NOTHING;

  -- Add delivery zones for other major cities
  INSERT INTO delivery_zones (city_id, name, base_delivery_fee, min_order_amount)
  SELECT 
    c.id,
    'Central Zone',
    35,
    200
  FROM cities c
  WHERE c.name IN ('Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad')
  ON CONFLICT DO NOTHING;

END $$;
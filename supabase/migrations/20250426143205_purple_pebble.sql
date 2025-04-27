/*
  # Address Management System

  1. New Tables
    - `states` - List of Indian states
    - `cities` - List of cities in India
    - `addresses` - User delivery addresses
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - Address label (e.g., "Home", "Work")
      - `street_address` (text)
      - `landmark` (text, optional)
      - `city_id` (uuid, references cities)
      - `pincode` (text)
      - `is_default` (boolean)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create states table
CREATE TABLE IF NOT EXISTS states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_id uuid REFERENCES states(id),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(state_id, name)
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  street_address text NOT NULL,
  landmark text,
  city_id uuid REFERENCES cities(id) NOT NULL,
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  phone text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "States are viewable by all users"
  ON states
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Cities are viewable by all users"
  ON cities
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can view their own addresses"
  ON addresses
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON addresses
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON addresses
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert Tamil Nadu cities
DO $$ 
BEGIN
  -- Insert Tamil Nadu
  INSERT INTO states (name) VALUES ('Tamil Nadu')
  ON CONFLICT (name) DO NOTHING;

  -- Get Tamil Nadu state_id
  WITH tn AS (SELECT id FROM states WHERE name = 'Tamil Nadu')
  INSERT INTO cities (state_id, name)
  VALUES
    ((SELECT id FROM tn), 'Chennai'),
    ((SELECT id FROM tn), 'Coimbatore'),
    ((SELECT id FROM tn), 'Madurai'),
    ((SELECT id FROM tn), 'Salem'),
    ((SELECT id FROM tn), 'Tiruchirappalli'),
    ((SELECT id FROM tn), 'Tiruppur'),
    ((SELECT id FROM tn), 'Erode'),
    ((SELECT id FROM tn), 'Vellore'),
    ((SELECT id FROM tn), 'Thoothukkudi'),
    ((SELECT id FROM tn), 'Dindigul'),
    ((SELECT id FROM tn), 'Thanjavur'),
    ((SELECT id FROM tn), 'Ranipet'),
    ((SELECT id FROM tn), 'Sivakasi'),
    ((SELECT id FROM tn), 'Karur'),
    ((SELECT id FROM tn), 'Udhagamandalam'),
    ((SELECT id FROM tn), 'Hosur'),
    ((SELECT id FROM tn), 'Nagercoil'),
    ((SELECT id FROM tn), 'Kanchipuram'),
    ((SELECT id FROM tn), 'Kumarapalayam'),
    ((SELECT id FROM tn), 'Karaikkudi')
  ON CONFLICT (state_id, name) DO NOTHING;
END $$;
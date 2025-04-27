/*
  # Update RLS policies for profiles table

  1. Changes
    - Update RLS policies to allow profile creation during signup
    - Ensure users can only access their own profile data
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;

-- Create updated policies
CREATE POLICY "Enable insert for authenticated users only"
ON profiles FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on id"
ON profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for users based on id"
ON profiles FOR SELECT TO authenticated
USING (auth.uid() = id);
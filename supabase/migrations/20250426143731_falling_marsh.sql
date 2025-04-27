/*
  # Add RLS policies for profiles table

  1. Changes
    - Enable RLS on profiles table
    - Add policies for authenticated users to:
      - Insert their own profile
      - Update their own profile
      - Read their own profile

  2. Security
    - Users can only access their own profile data
    - Service role can bypass RLS for admin operations
*/

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);
-- *********************************************************************************
-- PROFILES
-- *********************************************************************************
create table if not exists profiles (
    profile_id UUID REFERENCES auth.users(id),
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

alter table profiles enable row level security;

-- Allow authenticated users to view only their own profile
CREATE POLICY select_profile ON profiles
  FOR SELECT
  USING (profile_id = auth.uid());

-- Allow authenticated users to create a profile only if the profile_id matches their own user ID
CREATE POLICY insert_profile ON profiles
  FOR INSERT
  WITH CHECK (profile_id = auth.uid());

-- Allow authenticated users to update their own profile
CREATE POLICY update_profile ON profiles
  FOR UPDATE
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- Allow authenticated users to delete their own profile
CREATE POLICY delete_profile ON profiles
  FOR DELETE
  USING (profile_id = auth.uid());
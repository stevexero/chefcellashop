-- *********************************************************************************
-- ADDRESS 
-- *********************************************************************************
CREATE TABLE addresses (
    address_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id UUID REFERENCES profiles(profile_id),
    temp_user_id UUID REFERENCES temp_users(temp_user_id),
    street_address TEXT NOT NULL,
    street_address_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'US',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT address_user_check CHECK (
        (profile_id IS NOT NULL AND temp_user_id IS NULL) OR
        (profile_id IS NULL AND temp_user_id IS NOT NULL)
    )
);

-- Enable RLS on addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_addresses ON addresses
  FOR SELECT
  USING (true);

CREATE POLICY insert_addresses ON addresses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY update_addresses ON addresses
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY delete_addresses ON addresses
  FOR DELETE
  USING (true);
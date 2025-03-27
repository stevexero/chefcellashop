-- *********************************************************************************
-- TEMP USER (GUEST USERS) 
-- *********************************************************************************
create table if not exists temp_users (
    temp_user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on temp_users
ALTER TABLE temp_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_temp_users ON temp_users
  FOR SELECT
  USING (true);

CREATE POLICY insert_temp_users ON temp_users
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY delete_temp_users ON temp_users
  FOR DELETE
  USING (true);
    


-- *********************************************************************************
-- SIZES
-- *********************************************************************************
create table if not exists sizes (
    size_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    size TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

alter table sizes enable row level security;

-- Allow anyone to read sizes
CREATE POLICY read_sizes ON sizes
  FOR SELECT
  USING (true);

-- Allow only authenticated users to insert new sizes
CREATE POLICY insert_sizes ON sizes 
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to update sizes
CREATE POLICY update_sizes ON sizes
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to delete sizes
CREATE POLICY delete_sizes ON sizes
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- *********************************************************************************
-- COLORS
-- *********************************************************************************
create table if not exists colors (
    color_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    color_name TEXT NOT NULL UNIQUE,
    color_hex_code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

alter table colors enable row level security;

-- Allow anyone to read colors
CREATE POLICY read_colors ON colors
  FOR SELECT
  USING (true);

-- Allow only authenticated users to insert new colors
CREATE POLICY insert_colors ON colors
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to update colors
CREATE POLICY update_colors ON colors
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to delete colors
CREATE POLICY delete_colors ON colors
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
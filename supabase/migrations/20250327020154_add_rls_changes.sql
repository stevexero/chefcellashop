-- *********************************************************************************
-- CATEGORIES
-- *********************************************************************************
create table if not exists categories (
    category_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

alter table categories enable row level security;

-- Allow anyone to read categories
CREATE POLICY read_categories ON categories
  FOR SELECT
  USING (true);

-- Allow only authenticated users to insert new categories
CREATE POLICY insert_categories ON categories
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to update categories
CREATE POLICY update_categories ON categories
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to delete categories
CREATE POLICY delete_categories ON categories
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- *********************************************************************************
-- PRODUCTS
-- *********************************************************************************
create table if not exists products (
    product_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES categories(category_id),
    product_name TEXT NOT NULL,
    product_description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

alter table products enable row level security;

-- Allow anyone to read products
CREATE POLICY read_products ON products
  FOR SELECT
  USING (true);

-- Allow only authenticated users to insert new products
CREATE POLICY insert_products ON products
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to update products
CREATE POLICY update_products ON products
  FOR UPDATE
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to delete products
CREATE POLICY delete_products ON products
  FOR DELETE
  USING (auth.uid() IS NOT NULL);
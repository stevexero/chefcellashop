-- *********************************************************************************
-- CARTS
-- *********************************************************************************
create table if not exists carts (
    cart_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(profile_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on carts
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_carts ON carts
  FOR SELECT
  USING (true);

CREATE POLICY insert_carts ON carts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY update_carts ON carts
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY delete_carts ON carts
  FOR DELETE
  USING (true);



-- *********************************************************************************
-- CART_ITEMS
-- *********************************************************************************
create table if not exists cart_items (
    cart_item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL REFERENCES products(product_id),
    size_id UUID NOT NULL REFERENCES sizes(size_id),
    color_id UUID NOT NULL REFERENCES colors(color_id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,   
);

-- Enable RLS on cart_items
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Allow users to select a cart_item by checking its parent cart:
CREATE POLICY select_cart_items ON cart_items
  FOR SELECT
  USING (true);

-- For inserts, updates, and deletes, you’d add similar subqueries in the WITH CHECK clause:
CREATE POLICY insert_cart_items ON cart_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY update_cart_items ON cart_items
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY delete_cart_items ON cart_items
  FOR DELETE
  USING (true);

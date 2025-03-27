-- Create orders table
CREATE TABLE orders (
    order_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL,
    profile_id UUID REFERENCES profiles(profile_id),
    temp_user_id UUID REFERENCES temp_users(temp_user_id),
    payment_id TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    tracking_number TEXT,
    tracking_company TEXT,
    shipping_address_id UUID REFERENCES addresses(address_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT order_user_check CHECK (
        (profile_id IS NOT NULL AND temp_user_id IS NULL) OR
        (profile_id IS NULL AND temp_user_id IS NOT NULL)
    )
);

-- Create order_line_items table
CREATE TABLE order_line_items (
    order_item_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(order_id),
    product_id UUID REFERENCES products(product_id),
    size_id UUID REFERENCES sizes(size_id),
    color_id UUID REFERENCES colors(color_id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_orders ON orders
  FOR SELECT
  USING (true);

CREATE POLICY insert_orders ON orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY update_orders ON orders
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY select_order_line_items ON order_line_items
  FOR SELECT
  USING (true);

CREATE POLICY insert_order_line_items ON order_line_items
  FOR INSERT
  WITH CHECK (true);




-- Create a sequence for order numbers
CREATE SEQUENCE order_number_seq;

-- Add order_number column to orders table
ALTER TABLE orders 
ADD COLUMN order_number INTEGER NOT NULL DEFAULT nextval('order_number_seq');

-- Create a function to automatically set the order number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = nextval('order_number_seq');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically set the order number
CREATE TRIGGER set_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    EXECUTE FUNCTION set_order_number();

-- Set the sequence to start from 1000 (or any number you prefer)
ALTER SEQUENCE order_number_seq RESTART WITH 1000;
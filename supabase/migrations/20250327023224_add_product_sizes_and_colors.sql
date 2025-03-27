-- *********************************************************************************
-- PRODUCT_SIZES 
-- *********************************************************************************
create table if not exists product_sizes (
    product_id UUID NOT NULL REFERENCES products(product_id),
    size_id UUID NOT NULL REFERENCES sizes(size_id),
    price_mod DECIMAL(10,2) NOT NULL DEFAULT 0,
    PRIMARY KEY (product_id, size_id)
);

-- Enable RLS on product_sizes
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read product_sizes
CREATE POLICY read_product_sizes ON product_sizes FOR SELECT USING (true);

-- Allow only authenticated users to insert new product_sizes
CREATE POLICY insert_product_sizes ON product_sizes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to update product_sizes
CREATE POLICY update_product_sizes ON product_sizes FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Allow only authenticated users to delete product_sizes
CREATE POLICY delete_product_sizes ON product_sizes FOR DELETE USING (auth.uid() IS NOT NULL);

-- *********************************************************************************
-- PRODUCT_COLORS
-- *********************************************************************************
create table if not exists product_colors (
    product_id UUID NOT NULL REFERENCES products(product_id),
    color_id UUID NOT NULL REFERENCES colors(color_id),
    PRIMARY KEY (product_id, color_id)
);

-- Enable RLS on product_colors
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read product_colors
CREATE POLICY read_product_colors ON product_colors FOR SELECT USING (true);

-- Allow only authenticated users to insert new product_colors
CREATE POLICY insert_product_colors ON product_colors FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow only authenticated users to update product_colors
CREATE POLICY update_product_colors ON product_colors FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Allow only authenticated users to delete product_colors
CREATE POLICY delete_product_colors ON product_colors FOR DELETE USING (auth.uid() IS NOT NULL);

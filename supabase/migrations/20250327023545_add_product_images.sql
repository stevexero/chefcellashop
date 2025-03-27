-- *********************************************************************************
-- PRODUCT_IMAGES
-- *********************************************************************************
create table if not exists product_images (
    image_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(product_id),
    image_url TEXT,
    color_id UUID REFERENCES colors(color_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on product_images
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read product_images
CREATE POLICY read_product_images ON product_images FOR SELECT USING (true);

-- Allow only authenticated users to insert new product_images
CREATE POLICY insert_product_images ON product_images FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);   

-- Allow only authenticated users to update product_images
CREATE POLICY update_product_images ON product_images FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Allow only authenticated users to delete product_images
CREATE POLICY delete_product_images ON product_images FOR DELETE USING (auth.uid() IS NOT NULL);




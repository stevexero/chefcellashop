import { User } from '@supabase/supabase-js';

// Colors
export interface ColorProps {
  color_id: string;
  color_name: string;
  color_hex_code: string;
}

// Sizes
export interface SizesProps {
  size_id: string;
  size: string;
}

export interface ProductSizeProps {
  size_id: string;
  price_mod: number;
  size: SizesProps;
}

export interface SizePriceModProps {
  size_id: string;
  price_mod: number;
}

// Cart
export interface CartItem {
  cart_id?: string;
  cart_item_id?: string;
  product_id?: string;
  size_id?: string | null;
  color_id?: string | null;
  quantity?: number;
  price?: number;
  products?: {
    product_name: string;
    product_images: { image_url: string; color_id?: string }[];
  }[];
  sizes?: { size: string }[] | null;
  colors?: { color_name: string }[] | null;
}

// Orders
export interface OrderData {
  amount: number;
  paymentId: string;
  email: string;
  address: {
    street_address: string;
    street_address_2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

// Categories
export interface CategoryProps {
  category_id: string;
  category_name: string;
}

export interface AddProductCategoryProps {
  user: User | null;
}

// Products
export interface QuickAddProductProps {
  user: User;
}

export interface ProductProps {
  product: {
    product_id: string;
    product_name: string;
    base_price: number;
    description?: string;
    category_id: string;
    product_images: ProductImageProps[];
    product_colors: { color: ColorProps }[];
    product_sizes: ProductSizeProps[];
    categories: CategoryProps;
  };
}

// Images
export interface ProductImageProps {
  image_url: string;
  color_id: string;
}

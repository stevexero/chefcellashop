import { User } from '@supabase/supabase-js';

export interface ColorProps {
  color_id: string;
  color_name: string;
  color_hex_code: string;
}

export interface CartItem {
  cart_id?: string;
  cart_item_id?: string;
  product_id?: string;
  size_id?: string | null;
  color_id?: string | null;
  quantity?: number;
  price?: number;
  products?: { product_name: string; product_images: ProductImage[] }[];
  sizes?: { size: string }[] | null;
  colors?: { color_name: string }[] | null;
}

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

export interface AddProductCategoryProps {
  user: User | null;
}

export interface QuickAddProductProps {
  user: User;
}

export interface CategoryProps {
  category_id: string;
  category_name: string;
}

export interface SizesProps {
  size_id: string;
  size: string;
}

export interface SizePriceModProps {
  size_id: string;
  price_mod: number;
}

export interface ProductImage {
  image_url: string;
}

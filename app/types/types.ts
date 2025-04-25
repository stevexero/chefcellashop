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

export interface ProductSizesProps {
  sizes: ProductSizeProps[];
  basePrice: number;
}

export interface SizePriceModProps {
  size_id: string;
  price_mod: number;
}

export interface SizeSelectorProps {
  sizes: ProductSizeProps[];
  basePrice: number;
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

export interface AddItemToCartProps {
  productId: string;
  isOneSize: boolean;
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

export interface OrderDetails {
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  orderAmount: number;
  customer: {
    email: string;
    first_name: string;
    last_name: string;
  };
  orderItems: Array<{
    products: {
      product_images: { image_url: string; color_id: string }[];
      product_name: string;
    };
    sizes: { size: string; size_id: string } | null;
    colors: { color_name: string; color_id: string } | null;
    quantity: number;
    price: number;
  }>;
}

export interface OrderDetailsProps {
  order: {
    order_id: string;
    order_number: number;
    amount: number;
    status: string;
    created_at: string;
    tracking_number?: string;
    tracking_company?: string;
    addresses: {
      street_address: string;
      street_address_2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  customerDetails: {
    email: string;
    first_name: string;
    last_name: string;
  };
  orderItems: Array<{
    quantity: number;
    price: number;
    products: {
      product_name: string;
      product_images: { image_url: string; color_id: string }[];
    };
    sizes: { size: string } | null;
    colors: { color_name: string; color_id: string } | null;
  }>;
}

export interface OrderSummaryProps {
  paymentId: string;
  clientSecret: string;
  redirectStatus: string;
}

export interface OrderPageProps {
  params: Promise<{
    order_id: string;
  }>;
}

// Order Items
export interface OrderItemProps {
  item: {
    products: {
      product_images: { image_url: string; color_id: string }[];
      product_name: string;
    };
    sizes: { size: string } | null;
    colors: { color_name: string; color_id: string } | null;
    quantity: number;
    price: number;
  };
}

export interface OrderLineItemProps {
  order_item_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products: {
    product_name: string;
    product_images: { image_url: string; color_id: string }[];
  };
  sizes: { size: string; size_id: string } | null;
  colors: { color_name: string; color_id: string } | null;
}

// Customers
export interface CustomerDetailsProps {
  email: string;
  firstName: string;
  lastName: string;
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

export interface ProductNameProps {
  productName: string | undefined;
}

export interface ProductPriceProps {
  adjustedPrice: number | 0;
}

export interface ProductDescriptionProps {
  description: string | undefined;
}

export interface ProductColorsProps {
  product: {
    product_id: string;
    product_images: { image_url: string; color_id: string }[];
    product_colors: {
      color: { color_id: string; color_name: string; color_hex_code: string };
    }[];
  };
}

export interface ProductDetailsProps {
  product: {
    product_id: string;
    product_name: string;
    base_price: number;
    description?: string;
    product_images: ProductImageProps[];
    product_colors: { color: ColorProps }[];
    product_sizes: ProductSizeProps[];
    categories: CategoryProps;
  };
}

export interface ProductColorSelectorProps {
  product: {
    product_id: string;
    product_images: { image_url: string; color_id: string }[];
    product_colors: {
      color: { color_id: string; color_name: string; color_hex_code: string };
    }[];
  };
}

// Images
export interface ProductImageProps {
  image_url: string;
  color_id: string;
}

// Users
export interface UserProfileProps {
  profile_id?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  created_at?: string;
  role?: string;
}

export interface ProfileUpdateFormProps {
  userProfile: UserProfileProps;
}

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          product_id: string;
          category_id: string | null;
          product_name: string;
          product_description: string | null;
          base_price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          product_id?: string;
          category_id?: string | null;
          product_name: string;
          product_description?: string | null;
          base_price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          product_id?: string;
          category_id?: string | null;
          product_name?: string;
          product_description?: string | null;
          base_price?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          category_id: string;
          category_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          category_id?: string;
          category_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          category_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          profile_id: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          profile_id: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          profile_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sizes: {
        Row: {
          size_id: string;
          size_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          size_id?: string;
          size_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          size_id?: string;
          size_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      colors: {
        Row: {
          color_id: string;
          color_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          color_id?: string;
          color_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          color_id?: string;
          color_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      carts: {
        Row: {
          cart_id: string;
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          cart_id?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          cart_id?: string;
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          cart_item_id: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          cart_item_id?: string;
          cart_id: string;
          product_id: string;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          cart_item_id?: string;
          cart_id?: string;
          product_id?: string;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_sizes: {
        Row: {
          product_id: string;
          size_id: string;
        };
        Insert: {
          product_id: string;
          size_id: string;
        };
        Update: {
          product_id?: string;
          size_id?: string;
        };
      };
      product_colors: {
        Row: {
          product_id: string;
          color_id: string;
        };
        Insert: {
          product_id: string;
          color_id: string;
        };
        Update: {
          product_id?: string;
          color_id?: string;
        };
      };
      product_images: {
        Row: {
          product_image_id: string;
          product_id: string;
          image_url: string | null;
          color_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          product_image_id?: string;
          product_id: string;
          image_url?: string | null;
          color_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          product_image_id?: string;
          product_id?: string;
          image_url?: string | null;
          color_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      addresses: {
        Row: {
          address_id: string;
          profile_id: string | null;
          street_address: string;
          street_address_2: string | null;
          city: string;
          state: string;
          postal_code: string;
          country: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          address_id?: string;
          profile_id?: string | null;
          street_address: string;
          street_address_2?: string | null;
          city: string;
          state: string;
          postal_code: string;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          address_id?: string;
          profile_id?: string | null;
          street_address?: string;
          street_address_2?: string | null;
          city?: string;
          state?: string;
          postal_code?: string;
          country?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

import { create } from 'zustand';

interface ProductImage {
  image_url: string;
}

interface CartItem {
  cart_item_id: string;
  product_id: string;
  size_id: string | null;
  color_id: string | null;
  quantity: number;
  price: number;
  products: { product_name: string; product_images: ProductImage[] }[];
  sizes: { size: string }[] | null;
  colors: { color_name: string }[] | null;
}

interface CartStore {
  cartItems: CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
  itemQuantities: Record<string, number>;
  setItemQuantity: (cart_item_id: string, quantity: number) => void;
  resetItemQuantities: () => void;
}

export const useStore = create<CartStore>((set) => ({
  cartItems: [],
  setCartItems: (cartItems) =>
    set({
      cartItems,
      // Initialize quantities from cart items
      itemQuantities: cartItems.reduce(
        (acc, item) => ({
          ...acc,
          [item.cart_item_id]: item.quantity,
        }),
        {}
      ),
    }),
  itemQuantities: {},
  setItemQuantity: (cart_item_id, quantity) =>
    set((state) => ({
      itemQuantities: {
        ...state.itemQuantities,
        [cart_item_id]: quantity,
      },
    })),
  resetItemQuantities: () => set({ itemQuantities: {} }),
}));

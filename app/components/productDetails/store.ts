'use client';

import { create } from 'zustand';

interface Size {
  size_id: string;
  size: string;
}

interface ProductSize {
  size_id: string;
  price_mod: number;
  size: Size;
}

interface Color {
  color_id: string;
  color_name: string;
  color_hex_code: string;
}

interface StoreState {
  selectedSize: string | null;
  setSelectedSize: (sizeId: string) => void;

  sizeName: string;
  setSizeName: (name: string) => void;

  adjustedPrice: number;
  setAdjustedPrice: (price: number) => void;

  initializeSize: (sizes: ProductSize[], basePrice: number) => void;

  selectedColorId: string | null;
  setSelectedColorId: (colorId: string) => void;

  selectedColorName: string;
  setSelectedColorName: (name: string) => void;

  initializeColor: (colors: { color: Color }[]) => void;

  quantity: number;
  setQuantity: (qty: number) => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedSize: null,
  setSelectedSize: (sizeId: string) => set({ selectedSize: sizeId }),

  sizeName: '',
  setSizeName: (name: string) => set({ sizeName: name }),

  adjustedPrice: 0,
  setAdjustedPrice: (price: number) => set({ adjustedPrice: price }),

  initializeSize: (sizes: ProductSize[], basePrice: number) => {
    if (sizes.length > 0) {
      const firstSize = sizes[0];
      set({
        selectedSize: firstSize.size_id,
        sizeName: firstSize.size.size,
        adjustedPrice: basePrice + firstSize.price_mod,
      });
    } else {
      set({
        selectedSize: null,
        sizeName: 'One Size',
        adjustedPrice: basePrice,
      });
    }
  },

  selectedColorId: null,
  setSelectedColorId: (colorId: string) => set({ selectedColorId: colorId }),

  selectedColorName: '',
  setSelectedColorName: (name: string) => set({ selectedColorName: name }),

  initializeColor: (colors: { color: Color }[]) => {
    if (colors.length > 0) {
      const firstColor = colors[0].color;
      set({
        selectedColorId: firstColor.color_id,
        selectedColorName: firstColor.color_name,
      });
    }
  },

  quantity: 1,
  setQuantity: (qty: number) => set({ quantity: qty }),
}));

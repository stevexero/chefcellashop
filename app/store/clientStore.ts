'use client';

import { create } from 'zustand';

type ModalType = 'user' | 'cart' | 'add-product-modal' | null;

interface ClientStoreState {
  selectedSize: string;
  setSelectedSize: (size: string) => void;

  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  toggleModal: (modal: ModalType) => void;

  categoryId: string;
  setCategoryId: (val: string) => void;
}

export const useClientStore = create<ClientStoreState>((set) => ({
  selectedSize: 'M',
  setSelectedSize: (size: string) => set({ selectedSize: size }),

  activeModal: null,
  setActiveModal: (modal: ModalType) => set({ activeModal: modal }),
  toggleModal: (modal: ModalType) =>
    set((state) => ({
      activeModal: state.activeModal === modal ? null : modal,
    })),

  categoryId: 'select-category',
  setCategoryId: (val: string) => set({ categoryId: val }),
}));

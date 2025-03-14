'use client';

import { create } from 'zustand';

type ModalType = 'user' | 'cart' | null;

interface ClientStoreState {
  quantity: number;
  setQuantity: (qty: number) => void;

  selectedSize: string;
  setSelectedSize: (size: string) => void;

  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  toggleModal: (modal: ModalType) => void;
}

export const useClientStore = create<ClientStoreState>((set) => ({
  quantity: 1,
  setQuantity: (qty: number) => set({ quantity: qty }),

  selectedSize: 'M',
  setSelectedSize: (size: string) => set({ selectedSize: size }),

  activeModal: null,
  setActiveModal: (modal: ModalType) => set({ activeModal: modal }),
  toggleModal: (modal: ModalType) =>
    set((state) => ({
      activeModal: state.activeModal === modal ? null : modal,
    })),
}));

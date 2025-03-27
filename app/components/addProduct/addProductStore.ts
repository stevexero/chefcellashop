'use client';

import { create } from 'zustand';
import { SizesProps, SizePriceModProps, ColorProps } from '@/app/types/types';

interface StoreState {
  productName: string;
  setProductName: (val: string) => void;

  productDescription: string;
  setProductDescription: (val: string) => void;

  productBasePrice: number;
  setProductBasePrice: (val: number) => void;

  imageColorAssignments: { [key: number]: ColorProps | null };
  setImageColorAssignments: (
    assignments:
      | { [key: number]: ColorProps | null }
      | ((prev: { [key: number]: ColorProps | null }) => {
          [key: number]: ColorProps | null;
        })
  ) => void;

  variedSizesSelected: boolean;
  setVariedSizedSelected: (val: boolean) => void;

  sizes: SizesProps[];
  setSizes: (
    sizes: SizesProps[] | ((prev: SizesProps[]) => SizesProps[])
  ) => void;

  sizePriceModifiers: SizePriceModProps[];
  setSizePriceModifiers: (
    sizePriceModifiers:
      | SizePriceModProps[]
      | ((prev: SizePriceModProps[]) => SizePriceModProps[])
  ) => void;

  showAddSizeForm: boolean;
  toggleShowAddSizeForm: () => void;

  sizeText: string;
  setSizeText: (val: string) => void;

  message: string;
  setMessage: (val: string) => void;

  colors: ColorProps[];
  setColors: (
    colors: ColorProps[] | ((prev: ColorProps[]) => ColorProps[])
  ) => void;

  showAddColorForm: boolean;
  toggleShowAddColorForm: () => void;

  colorNameText: string;
  setColorNameText: (val: string) => void;

  colorHexCodeText: string;
  setColorHexCodeText: (val: string) => void;

  selectedColors: ColorProps[];
  setSelectedColors: (
    selectedColors: ColorProps[] | ((prev: ColorProps[]) => ColorProps[])
  ) => void;

  selectedSizes: SizesProps[];
  setSelectedSizes: (
    selectedSizes: SizesProps[] | ((prev: SizesProps[]) => SizesProps[])
  ) => void;

  selectedFiles: File[];
  setSelectedFiles: (
    selectedFiles: File[] | ((prev: File[]) => File[])
  ) => void;

  showColorDropdown: { [key: number]: boolean };
  setShowColorDropdown: (
    dropdown:
      | { [key: number]: boolean }
      | ((prev: { [key: number]: boolean }) => { [key: number]: boolean })
  ) => void;
}

export const useAddProductStore = create<StoreState>((set, get) => ({
  productName: '',
  setProductName: (val: string) => set({ productName: val }),

  productDescription: '',
  setProductDescription: (val: string) => set({ productDescription: val }),

  productBasePrice: 0.0,
  setProductBasePrice: (val: number) => set({ productBasePrice: val }),

  imageColorAssignments: {},
  setImageColorAssignments: (assignments) =>
    set({
      imageColorAssignments:
        typeof assignments === 'function'
          ? assignments(get().imageColorAssignments)
          : assignments,
    }),

  variedSizesSelected: false,
  setVariedSizedSelected: (val: boolean) =>
    set((state) => ({
      variedSizesSelected: val,
      selectedSizes: val
        ? state.selectedSizes
        : [
            {
              size_id: '00000000-0000-0000-0000-000000000001',
              size: 'one-size',
            },
          ],
      sizePriceModifiers: val ? state.sizePriceModifiers : [],
    })),

  sizes: [],
  setSizes: (sizes: SizesProps[] | ((prev: SizesProps[]) => SizesProps[])) =>
    set({
      sizes: typeof sizes === 'function' ? sizes(get().sizes) : sizes,
    }),

  sizePriceModifiers: [],
  setSizePriceModifiers: (
    sizePriceModifiers:
      | SizePriceModProps[]
      | ((prev: SizePriceModProps[]) => SizePriceModProps[])
  ) =>
    set({
      sizePriceModifiers:
        typeof sizePriceModifiers === 'function'
          ? sizePriceModifiers(get().sizePriceModifiers)
          : sizePriceModifiers,
    }),

  showAddSizeForm: false,
  toggleShowAddSizeForm: () =>
    set((state) => ({ showAddSizeForm: !state.showAddSizeForm })),

  sizeText: '',
  setSizeText: (val: string) => set({ sizeText: val }),

  message: '',
  setMessage: (val: string) => set({ message: val }),

  colors: [],
  setColors: (colors: ColorProps[] | ((prev: ColorProps[]) => ColorProps[])) =>
    set({
      colors: typeof colors === 'function' ? colors(get().colors) : colors,
    }),

  showAddColorForm: false,
  toggleShowAddColorForm: () =>
    set((state) => ({ showAddColorForm: !state.showAddColorForm })),

  colorNameText: '',
  setColorNameText: (val: string) => set({ colorNameText: val }),

  colorHexCodeText: '#ff0000',
  setColorHexCodeText: (val: string) => set({ colorHexCodeText: val }),

  selectedColors: [],
  setSelectedColors: (
    selectedColors: ColorProps[] | ((prev: ColorProps[]) => ColorProps[])
  ) =>
    set({
      selectedColors:
        typeof selectedColors === 'function'
          ? selectedColors(get().selectedColors)
          : selectedColors,
    }),

  selectedSizes: [],
  setSelectedSizes: (
    selectedSizes: SizesProps[] | ((prev: SizesProps[]) => SizesProps[])
  ) =>
    set({
      selectedSizes:
        typeof selectedSizes === 'function'
          ? selectedSizes(get().selectedSizes)
          : selectedSizes,
    }),

  selectedFiles: [],
  setSelectedFiles: (selectedFiles: File[] | ((prev: File[]) => File[])) =>
    set({
      selectedFiles:
        typeof selectedFiles === 'function'
          ? selectedFiles(get().selectedFiles)
          : selectedFiles,
    }),

  showColorDropdown: {},
  setShowColorDropdown: (
    dropdown:
      | { [key: number]: boolean }
      | ((prev: { [key: number]: boolean }) => { [key: number]: boolean })
  ) =>
    set({
      showColorDropdown:
        typeof dropdown === 'function'
          ? dropdown(get().showColorDropdown)
          : dropdown,
    }),
}));

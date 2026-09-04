import { create } from 'zustand';
import { api } from '../lib/api';

export interface CartProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice?: string;
  stock: number;
  images: { url: string }[];
}

export interface CartItem {
  id: string;
  quantity: number;
  product: CartProduct;
  variant?: { id: string; name: string; value: string } | null;
}

export interface Cart {
  id?: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

interface CartState {
  cart: Cart;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number, variantId?: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const emptyCart: Cart = { items: [], subtotal: 0, itemCount: 0 };

export const useCartStore = create<CartState>((set) => ({
  cart: emptyCart,
  isLoading: false,
  isDrawerOpen: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/cart');
      set({ cart: res.data.data.cart ?? emptyCart });
    } catch {
      set({ cart: emptyCart });
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity = 1, variantId) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/cart/items', { productId, quantity, variantId });
      set({ cart: res.data.data.cart, isDrawerOpen: true });
    } finally {
      set({ isLoading: false });
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ isLoading: true });
    try {
      const res = await api.patch(`/cart/items/${itemId}`, { quantity });
      set({ cart: res.data.data.cart });
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      set({ cart: res.data.data.cart });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true });
    try {
      await api.delete('/cart');
      set({ cart: emptyCart });
    } finally {
      set({ isLoading: false });
    }
  },
}));

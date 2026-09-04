import { create } from 'zustand';
import { api } from '../lib/api';

export interface WishlistProduct {
  id: string;
  name: string;
  slug: string;
  price: string;
  comparePrice?: string | null;
  stock: number;
  images: { url: string }[];
}

export interface WishlistItem {
  product: WishlistProduct;
}

export interface Wishlist {
  id: string;
  name: string;
  items: WishlistItem[];
  createdAt: string;
}

interface WishlistState {
  wishlists: Wishlist[];
  isLoading: boolean;
  fetchWishlists: () => Promise<void>;
  createWishlist: (name: string) => Promise<void>;
  renameWishlist: (id: string, name: string) => Promise<void>;
  deleteWishlist: (id: string) => Promise<void>;
  addItem: (wishlistId: string, productId: string) => Promise<void>;
  removeItem: (wishlistId: string, productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlists: [],
  isLoading: false,

  fetchWishlists: async () => {
    try {
      set({ isLoading: true });
      const res = await api.get('/wishlists');
      set({ wishlists: res.data.data.wishlists || [] });
    } catch {
      set({ wishlists: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  createWishlist: async (name: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/wishlists', { name });
      const newWishlist = res.data.data.wishlist;
      set((state) => ({ wishlists: [...state.wishlists, newWishlist] }));
    } finally {
      set({ isLoading: false });
    }
  },

  renameWishlist: async (id: string, name: string) => {
    set({ isLoading: true });
    try {
      const res = await api.patch(`/wishlists/${id}`, { name });
      const updated = res.data.data.wishlist;
      set((state) => ({
        wishlists: state.wishlists.map((w) => (w.id === id ? updated : w)),
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  deleteWishlist: async (id: string) => {
    set({ isLoading: true });
    try {
      await api.delete(`/wishlists/${id}`);
      set((state) => ({
        wishlists: state.wishlists.filter((w) => w.id !== id),
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (wishlistId: string, productId: string) => {
    set({ isLoading: true });
    try {
      const res = await api.post(`/wishlists/${wishlistId}/items`, { productId });
      const updated = res.data.data.wishlist;
      set((state) => ({
        wishlists: state.wishlists.map((w) => (w.id === wishlistId ? updated : w)),
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  removeItem: async (wishlistId: string, productId: string) => {
    set({ isLoading: true });
    try {
      const res = await api.delete(`/wishlists/${wishlistId}/items/${productId}`);
      const updated = res.data.data.wishlist;
      set((state) => ({
        wishlists: state.wishlists.map((w) => (w.id === wishlistId ? updated : w)),
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  isInWishlist: (productId: string) => {
    const { wishlists } = get();
    for (const w of wishlists) {
      if (w.items.some((item) => item.product.id === productId)) {
        return true;
      }
    }
    return false;
  },
}));

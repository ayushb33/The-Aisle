import { create } from 'zustand';
import { api } from '../lib/api';
import type { Order } from './checkoutStore';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  fetchOrders: () => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/orders');
      set({ orders: res.data.data.orders });
    } catch (err) {
      console.error(err);
      set({ orders: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrder: async (id: string) => {
    set({ isLoading: true, currentOrder: null });
    try {
      const res = await api.get(`/orders/${id}`);
      set({ currentOrder: res.data.data.order });
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  }
}));

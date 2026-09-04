import { create } from 'zustand';
import { api } from '../lib/api';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  subtotal: string;
  shippingCost: string;
  discount: string;
  total: string;
  createdAt: string;
  items: OrderItem[];
}

interface CheckoutState {
  isLoading: boolean;
  createOrder: (data: { addressId?: string; notes?: string }) => Promise<Order | null>;
  processPayment: (orderId: string, paymentMethod: string) => Promise<Order | null>;
}

export const useCheckoutStore = create<CheckoutState>((set) => ({
  isLoading: false,

  createOrder: async (data) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/orders/checkout', data);
      return res.data.data.order;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  processPayment: async (orderId, paymentMethod) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/payments/process', { orderId, paymentMethod });
      return res.data.data.order;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      set({ isLoading: false });
    }
  }
}));

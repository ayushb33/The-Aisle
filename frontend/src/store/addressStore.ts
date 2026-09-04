import { create } from 'zustand';
import { api } from '../lib/api';

export interface Address {
  id: string;
  label: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (data: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, data: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: [],
  isLoading: false,

  fetchAddresses: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/addresses');
      set({ addresses: res.data.data.addresses });
    } catch (err) {
      console.error(err);
      set({ addresses: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addAddress: async (data) => {
    set({ isLoading: true });
    try {
      await api.post('/addresses', data);
      await get().fetchAddresses();
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateAddress: async (id, data) => {
    set({ isLoading: true });
    try {
      await api.patch(`/addresses/${id}`, data);
      await get().fetchAddresses();
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAddress: async (id) => {
    set({ isLoading: true });
    try {
      await api.delete(`/addresses/${id}`);
      await get().fetchAddresses();
    } catch (err) {
      console.error(err);
    } finally {
      set({ isLoading: false });
    }
  }
}));

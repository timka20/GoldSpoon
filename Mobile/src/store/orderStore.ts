import { create } from 'zustand';
import { api } from '../api/client';
import type { Order, OrderCreateRequest } from '../types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  activeTableIds: number[];
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  createOrder: (data: OrderCreateRequest) => Promise<number>;
  getOrder: (id: number) => Promise<void>;
  clearCurrent: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  activeTableIds: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await api.getOrders();
      const completedStatuses = ['выдан', 'completed', 'завершён', 'отменён', 'cancelled'];
      const activeTableIds = orders
        .filter((o) => !completedStatuses.includes(o.Status.toLowerCase()))
        .map((o) => o.TableID);
      set({ orders, activeTableIds });
    } catch (err: any) {
      set({ error: err.message || 'Ошибка загрузки заказов' });
    } finally {
      set({ isLoading: false });
    }
  },

  createOrder: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.createOrder(data);
      await get().fetchOrders();
      return res.orderId;
    } catch (err: any) {
      set({ error: err.message || 'Ошибка создания заказа' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  getOrder: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const order = await api.getOrder(id);
      set({ currentOrder: order });
    } catch (err: any) {
      set({ error: err.message || 'Ошибка загрузки заказа' });
    } finally {
      set({ isLoading: false });
    }
  },

  clearCurrent: () => set({ currentOrder: null }),
}));

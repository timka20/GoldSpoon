import { create } from 'zustand';
import { api } from '../api/client';
import type { MenuItem } from '../types';

interface MenuState {
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
  getItem: (id: number) => MenuItem | undefined;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchMenu: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = await api.getMenu();
      set({ items: items.filter((i) => i.IsActive) });
    } catch (err: any) {
      set({ error: err.message || 'Ошибка загрузки меню' });
    } finally {
      set({ isLoading: false });
    }
  },

  getItem: (id) => get().items.find((i) => i.MenuItemID === id),
}));

import { create } from 'zustand';
import { api } from '../api/client';
import type { Reservation, Table } from '../types';

interface ReservationState {
  reservations: Reservation[];
  tables: Table[];
  isLoading: boolean;
  error: string | null;
  fetchReservations: () => Promise<void>;
  fetchTables: () => Promise<void>;
  createReservation: (data: { tableId: number; reservationDateTime: string; numberOfPeople: number }) => Promise<void>;
  deleteReservation: (id: number) => Promise<void>;
}

export const useReservationStore = create<ReservationState>((set, get) => ({
  reservations: [],
  tables: [],
  isLoading: false,
  error: null,

  fetchReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const reservations = await api.getReservations();
      set({ reservations });
    } catch (err: any) {
      set({ error: err.message || 'Ошибка загрузки бронирований' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTables: async () => {
    set({ isLoading: true, error: null });
    try {
      const tables = await api.getTables();
      set({ tables });
    } catch (err: any) {
      set({ error: err.message || 'Ошибка загрузки столов' });
    } finally {
      set({ isLoading: false });
    }
  },

  createReservation: async (data) => {
    set({ isLoading: true, error: null });
    try {
      await api.createReservation(data);
      await get().fetchReservations();
      await get().fetchTables();
    } catch (err: any) {
      set({ error: err.message || 'Ошибка бронирования' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteReservation: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteReservation(id);
      await get().fetchReservations();
      await get().fetchTables();
    } catch (err: any) {
      set({ error: err.message || 'Ошибка удаления бронирования' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

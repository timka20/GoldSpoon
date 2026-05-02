import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../api/client';
import type { User } from '../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

function parseApiError(err: any, defaultMsg: string): string {
  const msg = err?.message || '';
  const statusMatch = msg.match(/HTTP\s+(\d+)/);
  const status = statusMatch ? Number(statusMatch[1]) : 0;

  const jsonMatch = msg.match(/\{.*\}/);
  let body: any = {};
  if (jsonMatch) {
    try {
      body = JSON.parse(jsonMatch[0]);
    } catch {
    }
  }

  const bodyError = (body?.error || body?.message || '').toLowerCase();

  if (status === 401 || bodyError.includes('invalid credentials') || bodyError.includes('unauthorized')) {
    return 'Неверный логин или пароль';
  }
  if (status === 403 || bodyError.includes('forbidden')) {
    return 'Доступ запрещён';
  }
  if (status === 404 || bodyError.includes('not found') || bodyError.includes('не найден')) {
    return 'Пользователь не найден';
  }
  if (status === 409 || bodyError.includes('already exists') || bodyError.includes('duplicate')) {
    return 'Пользователь уже существует';
  }
  if (status === 422 || bodyError.includes('validation')) {
    return 'Некорректные данные';
  }
  if (status >= 500) {
    return 'Ошибка сервера. Попробуйте позже';
  }

  return defaultMsg;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await api.login(username, password);
          localStorage.setItem('token', res.token);
          set({ token: res.token, isAuthenticated: true });
          await get().loadUser();
        } catch (err: any) {
          set({ error: parseApiError(err, 'Ошибка авторизации') });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (username, password) => {
        set({ isLoading: true, error: null });
        try {
          await api.register(username, password);
          await get().login(username, password);
        } catch (err: any) {
          set({ error: parseApiError(err, 'Ошибка регистрации') });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false, error: null });
      },

      loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.userId || payload.sub || payload.id;
          if (userId) {
            const user = await api.getUser(Number(userId));
            set({ user, isAuthenticated: true });
          }
        } catch {
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

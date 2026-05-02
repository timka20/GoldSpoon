import React, { createContext, useContext, useState, useEffect, useRef, ReactNode, useCallback } from 'react';
import { authApi, usersApi, onAuthError } from '../services/api';

// Иерархия ролей:
// 1 - Клиент (базовый доступ)
// 2 - Официант
// 3 - Повар
// 4 - Уборщик
// 5 - Поставщик
// 6 - Администратор

const ROLE_NAMES: Record<number, string> = {
  1: 'Клиент',
  2: 'Официант',
  3: 'Повар',
  4: 'Уборщик',
  5: 'Поставщик',
  6: 'Администратор',
};

const ROLE_PANELS: Record<number, string> = {
  1: 'client',
  2: 'waiter',
  3: 'chef',
  4: 'cleaner',
  5: 'supplier',
  6: 'admin',
};

interface User {
  id: string;
  name: string;
  role: string;      // Название роли (Администратор, Официант и т.д.)
  roleId: number;    // ID роли (1-6)
  panel: string;     // Какую панель показывать (admin, waiter, chef, cleaner, supplier, client)
  UserID?: number;
  Username?: string;
  RoleId?: number;
  RoleName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useRef(false);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  // Global session expiration handler
  useEffect(() => {
    const unsubscribe = onAuthError(() => {
      console.log('[Auth] Session expired event received');
      logout();
      setError('Сессия истекла. Пожалуйста, войдите снова.');
    });
    return unsubscribe;
  }, [logout]);

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const token = authApi.getToken();
    if (token) {
      if (authApi.isTokenExpired(token)) {
        console.log('[Auth] Token expired on init');
        logout();
        setIsLoading(false);
        setError('Сессия истекла. Пожалуйста, войдите снова.');
        return;
      }
      loadUser();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userData = await usersApi.getCurrent();
      if (userData) {
        const roleId = userData.RoleId || 1;
        setUser({
          ...userData,
          id: userData.UserID.toString(),
          name: userData.Username,
          roleId: roleId,
          role: ROLE_NAMES[roleId] || `Роль ${roleId}`,
          panel: ROLE_PANELS[roleId] || 'client',
        });
      } else {
        setUser(null);
      }
    } catch (err: any) {
      console.error('Failed to load user:', err);
      setUser(null);
      if (err.status === 401 || err.message?.includes('Сессия истекла')) {
        logout();
        setError('Сессия истекла. Пожалуйста, войдите снова.');
      } else {
        setError(err.message || 'Ошибка загрузки пользователя');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await authApi.login(username, password);
      await loadUser();
    } catch (err: any) {
      setError(err.message || 'Ошибка входа');
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Пустой массив - мок данных больше нет
export const DEFAULT_USERS: User[] = [];

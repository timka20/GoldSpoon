const API_BASE = 'https://api.rpm.timka20.ru';

import { useAuthStore } from '../store/authStore';

function getToken(): string | null {
  return useAuthStore.getState().token;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 403) {
    useAuthStore.getState().logout();
    window.location.href = '/login';
    throw new Error('Сессия истекла, авторизируйтесь снова');
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json() as Promise<T>;
  }

  return undefined as unknown as T;
}

export const api = {
  login: (username: string, password: string) =>
    request<{ token: string }>('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  register: (username: string, password: string, roleId?: number) =>
    request<{ userId: number }>('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, ...(roleId ? { roleId } : {}) }),
    }),

  getUser: (id: number) => request<import('../types').User>(`/user/${id}`),

  getRoles: () => request<import('../types').Role[]>('/roles'),

  getTables: () => request<import('../types').Table[]>('/tables'),
  getTable: (id: number) => request<import('../types').Table>(`/tables/${id}`),

  getReservations: () => request<import('../types').Reservation[]>('/reservations'),
  createReservation: (data: { tableId: number; reservationDateTime: string; numberOfPeople: number }) =>
    request<{ reservationId: number }>('/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getReservation: (id: number) => request<import('../types').Reservation>(`/reservations/${id}`),
  deleteReservation: (id: number) =>
    request<void>(`/reservations/${id}`, { method: 'DELETE' }),

  getOrders: () => request<import('../types').Order[]>('/orders'),
  createOrder: (data: import('../types').OrderCreateRequest) =>
    request<{ orderId: number }>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getOrder: (id: number) => request<import('../types').Order>(`/orders/${id}`),
  updateOrderItems: (id: number, items: { menuItemId: number; quantity: number }[]) =>
    request<{ message: string }>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
  addOrderItems: (id: number, items: { menuItemId: number; quantity: number }[]) =>
    request<{ message: string }>(`/orders/${id}/items`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
  updateOrderStatus: (id: number, status: string) =>
    request<{ message: string }>(`/orders/status/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  getMenu: () => request<import('../types').MenuItem[]>('/menu'),
  getMenuItem: (id: number) => request<import('../types').MenuItem>(`/menu/${id}`),

  getTransactions: () => request<import('../types').Transaction[]>('/transactions'),
  createTransaction: (data: { orderId: number; amount: number }) =>
    request<{ transactionId: number }>('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createReview: (data: { orderId: number; rating: number; comment: string }) =>
    request<{ reviewId: number }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getReview: (orderId: number) =>
    request<import('../types').Review | null>(`/reviews/${orderId}`),
};

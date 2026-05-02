const API_BASE = 'https://api.rpm.timka20.ru';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (res.status === 204) {
    return null;
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || `HTTP ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  login: (username, password) =>
    request('/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: (username, password, roleId) =>
    request('/register', { method: 'POST', body: JSON.stringify({ username, password, roleId }) }),
  getUser: (id) => request(`/user/${id}`),
  getRoles: () => request('/roles'),

  getMenu: () => request('/menu'),
  getMenuItem: (id) => request(`/menu/${id}`),

  getTables: () => request('/tables'),
  getTable: (id) => request(`/tables/${id}`),

  getReservations: () => request('/reservations'),
  createReservation: (data) =>
    request('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  deleteReservation: (id) => request(`/reservations/${id}`, { method: 'DELETE' }),

  getOrders: () => request('/orders'),
  getOrder: (id) => request(`/orders/${id}`),
  createOrder: (data) =>
    request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateOrder: (id, items) =>
    request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify({ items }) }),
  addOrderItems: (id, items) =>
    request(`/orders/${id}/items`, { method: 'POST', body: JSON.stringify({ items }) }),
  updateOrderStatus: (id, status) =>
    request(`/orders/status/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  getTransactions: () => request('/transactions'),
  createTransaction: (orderId, amount) =>
    request('/transactions', { method: 'POST', body: JSON.stringify({ orderId, amount }) }),

  getReviews: () => request('/reviews'),
  getReviewByOrderId: (orderId) => request(`/reviews/${orderId}`),
  createReview: (data) =>
    request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
};

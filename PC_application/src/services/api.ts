// API Service for Restaurant Management System
const API_URL = 'https://api.rpm.timka20.ru';

// Token management
const getToken = () => localStorage.getItem('token');
const setToken = (token: string) => localStorage.setItem('token', token);
const removeToken = () => localStorage.removeItem('token');

// Auth error event for global session handling
const authEventTarget = new EventTarget();
export const onAuthError = (callback: () => void) => {
  const handler = () => callback();
  authEventTarget.addEventListener('auth:error', handler);
  return () => authEventTarget.removeEventListener('auth:error', handler);
};

// Sleep utility for retry
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generic fetch with auth and retry logic
const fetchWithAuth = async (endpoint: string, options: RequestInit = {}, retryCount = 2): Promise<any> => {
  const token = getToken();
  
  console.log(`API Request: ${options.method || 'GET'} ${endpoint}`, { hasToken: !!token });
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    console.warn('API Request without token:', endpoint);
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      // Handle 401 - Unauthorized (skip for /login to show proper error)
      if (response.status === 401 && endpoint !== '/login') {
        const error = new Error('Сессия истекла. Пожалуйста, войдите снова.');
        (error as any).status = 401;
        authEventTarget.dispatchEvent(new Event('auth:error'));
        throw error;
      }

      // Handle 503, 502, 504 - Server errors (retry)
      if ((response.status === 503 || response.status === 502 || response.status === 504) && attempt < retryCount) {
        console.log(`[API] Server error ${response.status}, retrying... (${attempt + 1}/${retryCount})`);
        await sleep(1000 * (attempt + 1));
        continue;
      }

      // Handle 500 - Internal Server Error (likely DB issue)
      if (response.status === 500) {
        const errorText = await response.text();
        if (errorText.includes('ECONNREFUSED') || errorText.includes('3306')) {
          throw new Error('БАЗА ДАННЫХ НЕДОСТУПНА: Сервер API не может подключиться к MySQL. Обратитесь к администратору сервера.');
        }
        throw new Error(`Ошибка сервера: ${response.status}. Внутренняя ошибка API.`);
      }

      if (!response.ok) {
        let errorMessage = `Ошибка сервера: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
      
    } catch (error: any) {
      lastError = error;
      
      // Don't retry if it's a DB error
      if (error.message?.includes('БАЗА ДАННЫХ НЕДОСТУПНА')) {
        throw error;
      }
      
      // Network errors - retry
      if ((error.name === 'TypeError' || error.name === 'AbortError') && attempt < retryCount) {
        console.log(`[API] Network error, retrying... (${attempt + 1}/${retryCount})`);
        await sleep(1000 * (attempt + 1));
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error('Неизвестная ошибка');
};

// Auth API
export const authApi = {
  login: async (username: string, password: string) => {
    try {
      const data = await fetchWithAuth('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      if (data.token) {
        setToken(data.token);
      }
      return data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (username: string, password: string, roleId: number = 1) => {
    return fetchWithAuth('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, roleId }),
    });
  },
  
  logout: () => {
    removeToken();
  },
  
  getToken,
  isAuthenticated: () => !!getToken(),
  isTokenExpired: (token?: string | null) => {
    const t = token || getToken();
    if (!t) return true;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      if (!payload.exp) return false;
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
  
  // Check if API is healthy
  healthCheck: async () => {
    try {
      await fetchWithAuth('/roles', {}, 0);
      return { ok: true, error: null };
    } catch (error: any) {
      return { ok: false, error: error.message };
    }
  }
};

// Roles API
export const rolesApi = {
  getAll: () => fetchWithAuth('/roles'),
  create: (name: string) =>
    fetchWithAuth('/admin/roles', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  delete: (id: number) =>
    fetchWithAuth(`/admin/roles/${id}`, { method: 'DELETE' }),
};

// Users API
export const usersApi = {
  getCurrent: async () => {
    const token = getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (!payload.userId) throw new Error('Invalid token: no userId');
      return await fetchWithAuth(`/user/${payload.userId}`);
    } catch (error) {
      console.error('[API] Failed to get current user:', error);
      removeToken();
      throw error;
    }
  },
  
  getById: (id: number) => fetchWithAuth(`/user/${id}`),
};

// Admin Users API
export const adminUsersApi = {
  getAll: () => fetchWithAuth('/admin/users'),
  delete: (id: number) => fetchWithAuth(`/admin/users/${id}`, { method: 'DELETE' }),
  updateRole: (id: number, roleId: number) => 
    fetchWithAuth(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ roleId }),
    }),
};

// Tables API
export const tablesApi = {
  getAll: () => fetchWithAuth('/tables'),
  getById: (id: number) => fetchWithAuth(`/tables/${id}`),
  create: (tableNumber: number, capacity: number) =>
    fetchWithAuth('/tables', {
      method: 'POST',
      body: JSON.stringify({ tableNumber, capacity }),
    }),
  update: (id: number, data: { tableNumber?: number; capacity?: number }) =>
    fetchWithAuth(`/admin/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) => fetchWithAuth(`/admin/tables/${id}`, { method: 'DELETE' }),
};

// Reservations API
export const reservationsApi = {
  getAll: () => fetchWithAuth('/reservations'),
  getById: (id: number) => fetchWithAuth(`/reservations/${id}`),
  create: (tableId: number, reservationDateTime: string, numberOfPeople: number) =>
    fetchWithAuth('/reservations', {
      method: 'POST',
      body: JSON.stringify({ tableId, reservationDateTime, numberOfPeople }),
    }),
  delete: (id: number) => fetchWithAuth(`/reservations/${id}`, { method: 'DELETE' }),
  adminDelete: (id: number) => fetchWithAuth(`/admin/reservations/${id}`, { method: 'DELETE' }),
};

// Orders API
export const ordersApi = {
  getAll: () => fetchWithAuth('/orders'),
  getById: (id: number) => fetchWithAuth(`/orders/${id}`),
  create: (tableId: number, items: { menuItemId: number; quantity: number }[]) =>
    fetchWithAuth('/orders', {
      method: 'POST',
      body: JSON.stringify({ tableId, items }),
    }),
  update: (id: number, items: { menuItemId: number; quantity: number }[]) =>
    fetchWithAuth(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ items }),
    }),
  addItems: (id: number, items: { menuItemId: number; quantity: number }[]) =>
    fetchWithAuth(`/orders/${id}/items`, {
      method: 'POST',
      body: JSON.stringify({ items }),
    }),
  updateStatus: async (id: number, status: string) => {
    try {
      console.log(`API: Updating order ${id} status to ${status}`);
      const result = await fetchWithAuth(`/orders/status/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      console.log('API: Update status result:', result);
      return result;
    } catch (error: any) {
      console.error(`API: Failed to update order ${id} status:`, error);
      throw error;
    }
  },
  delete: (id: number) => fetchWithAuth(`/admin/orders/${id}`, { method: 'DELETE' }),
};

// Menu API
export const menuApi = {
  getAll: () => fetchWithAuth('/menu'),
  getById: (id: number) => fetchWithAuth(`/menu/${id}`),
  create: (name: string, description: string, price: number, isActive: boolean = true, image?: string) =>
    fetchWithAuth('/menu', {
      method: 'POST',
      body: JSON.stringify({ name, description, price, isActive, image }),
    }),
  update: (id: number, data: { name?: string; description?: string; price?: number; isActive?: boolean; image?: string }) =>
    fetchWithAuth(`/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) => fetchWithAuth(`/menu/${id}`, { method: 'DELETE' }),
};

// Transactions API
export const transactionsApi = {
  getAll: () => fetchWithAuth('/transactions'),
  getById: (id: number) => fetchWithAuth(`/transactions/${id}`),
  create: (orderId: number, amount: number) =>
    fetchWithAuth('/transactions', {
      method: 'POST',
      body: JSON.stringify({ orderId, amount }),
    }),
};

// Reviews API
export const reviewsApi = {
  getAll: () => fetchWithAuth('/reviews'),
  getByOrderId: (orderId: number) => fetchWithAuth(`/reviews/${orderId}`),
  create: (orderId: number, rating: number, comment?: string) =>
    fetchWithAuth('/reviews', {
      method: 'POST',
      body: JSON.stringify({ orderId, rating, comment }),
    }),
  adminGetAll: () => fetchWithAuth('/admin/reviews'),
  adminUpdate: (id: number, data: { rating?: number; comment?: string }) =>
    fetchWithAuth(`/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  adminDelete: (id: number) => fetchWithAuth(`/admin/reviews/${id}`, { method: 'DELETE' }),
};

// Recipes API
export const recipesApi = {
  getAll: () => fetchWithAuth('/recipes'),
  getById: (id: number) => fetchWithAuth(`/recipes/${id}`),
  create: (data: {
    name: string;
    category?: string;
    cookingTime?: number;
    difficulty?: string;
    rating?: number;
    menuItemId?: number;
    ingredients?: { name: string; quantity?: string }[];
    steps?: { description: string; tip?: string }[];
  }) =>
    fetchWithAuth('/recipes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: {
    name?: string;
    category?: string;
    cookingTime?: number;
    difficulty?: string;
    rating?: number;
    menuItemId?: number;
    ingredients?: { name: string; quantity?: string }[];
    steps?: { description: string; tip?: string }[];
  }) =>
    fetchWithAuth(`/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) => fetchWithAuth(`/recipes/${id}`, { method: 'DELETE' }),
};

// Kitchen API
export const kitchenApi = {
  getTeam: () => fetchWithAuth('/kitchen/team'),
  getEquipment: () => fetchWithAuth('/kitchen/equipment'),
  updateEquipment: (id: number, status: string) =>
    fetchWithAuth(`/kitchen/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  getInventory: () => fetchWithAuth('/kitchen/inventory'),
  updateInventory: (id: number, data: { quantity?: string; status?: string }) =>
    fetchWithAuth(`/kitchen/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Admin API
export const adminApi = {
  getUsers: () => fetchWithAuth('/admin/users'),
  getTables: () => fetchWithAuth('/admin/tables'),
  getReservations: () => fetchWithAuth('/admin/reservations'),
  getOrders: () => fetchWithAuth('/admin/orders'),
  getTransactions: () => fetchWithAuth('/admin/transactions'),
};

// Types
export interface User {
  UserID: number;
  Username: string;
  RoleId: number;
  CreatedDate: string;
  RoleName?: string;
}

export interface Role {
  Id: number;
  Name: string;
}

export interface Table {
  TableID: number;
  TableNumber: number;
  Capacity: number;
  IsReserved?: number | boolean;
}

export interface Reservation {
  ReservationID: number;
  TableID: number;
  UserID: number;
  ReservationDateTime: string;
  NumberOfPeople: number;
  UserUsername?: string;
  TableNumber?: number;
}

export interface OrderItem {
  MenuItemID: number;
  Quantity: number;
  MenuItemName?: string;
  Price?: number;
  IsExtra?: number | boolean;
}

export interface Order {
  OrderID: number;
  UserID: number;
  TableID: number;
  OrderDateTime: string;
  Status: string;
  UserUsername?: string;
  TableNumber?: number;
  items?: OrderItem[];
}

export interface MenuItem {
  MenuItemID: number;
  Name: string;
  Description: string;
  Price: number;
  IsActive: boolean;
  Image?: string;
}

export interface Review {
  ReviewID: number;
  OrderID: number;
  Rating: number;
  Comment?: string;
  CreatedAt: string;
  UserID?: number;
  UserUsername?: string;
}

export interface Transaction {
  TransactionID: number;
  OrderID: number;
  Amount: number;
  TransactionDateTime: string;
  UserID?: number;
  UserUsername?: string;
}

export interface RecipeIngredient {
  RecipeIngredientID: number;
  RecipeID: number;
  Name: string;
  Quantity: string;
}

export interface RecipeStep {
  RecipeStepID: number;
  RecipeID: number;
  StepNumber: number;
  Description: string;
  Tip?: string;
}

export interface Recipe {
  RecipeID: number;
  MenuItemID?: number;
  Name: string;
  Category: string;
  CookingTime: number;
  Difficulty: string;
  Rating: number;
  CreatedAt: string;
  ingredients?: RecipeIngredient[];
  steps?: RecipeStep[];
}

export interface KitchenEquipmentItem {
  EquipmentID: number;
  Name: string;
  Status: string;
}

export interface InventoryItem {
  InventoryID: number;
  Name: string;
  Quantity: string;
  Status: string;
}

// Cleaner API
export interface CleaningTask {
  TaskID: number;
  Title: string;
  Description?: string;
  Area?: string;
  Priority: 'low' | 'medium' | 'high';
  Status: 'pending' | 'in-progress' | 'completed';
  EstimatedTime: number;
  AssignedTo?: number;
  DueTime?: string;
  CreatedAt: string;
  CompletedAt?: string;
  TableID?: number;
  Checklist?: string | any[];
}

export interface CleaningZone {
  ZoneID: number;
  Name: string;
  Status: 'clean' | 'needs-attention' | 'dirty';
  LastCleaned?: string;
  TasksCount: number;
}

export interface CleaningScheduleItem {
  ScheduleID: number;
  TaskName: string;
  Description?: string;
  Area?: string;
  Priority: 'low' | 'medium' | 'high';
  EstimatedTime: number;
  IntervalMinutes: number;
  LastRun?: string;
  IsActive: number;
}

export const cleanerApi = {
  getTasks: () => fetchWithAuth('/cleaner/tasks'),
  createTask: (data: {
    title: string;
    description?: string;
    area?: string;
    priority?: string;
    estimatedTime?: number;
    assignedTo?: number;
    dueTime?: string;
    tableId?: number;
    checklist?: any[];
  }) =>
    fetchWithAuth('/cleaner/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (id: number, data: {
    status?: string;
    assignedTo?: number;
    checklist?: any[];
    completedAt?: string;
  }) =>
    fetchWithAuth(`/cleaner/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  generateTasks: () => fetchWithAuth('/cleaner/tasks/generate', { method: 'POST' }),
  deleteTask: (id: number) => fetchWithAuth(`/cleaner/tasks/${id}`, { method: 'DELETE' }),

  getZones: () => fetchWithAuth('/cleaner/zones'),
  updateZone: (id: number, data: {
    status?: string;
    lastCleaned?: string;
    tasksCount?: number;
  }) =>
    fetchWithAuth(`/cleaner/zones/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  getSchedule: () => fetchWithAuth('/cleaner/schedule'),
  createSchedule: (data: {
    taskName: string;
    description?: string;
    area?: string;
    priority?: string;
    estimatedTime?: number;
    intervalMinutes?: number;
  }) =>
    fetchWithAuth('/cleaner/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSchedule: (id: number, data: {
    taskName?: string;
    description?: string;
    area?: string;
    priority?: string;
    estimatedTime?: number;
    intervalMinutes?: number;
    isActive?: number;
    lastRun?: string;
  }) =>
    fetchWithAuth(`/cleaner/schedule/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSchedule: (id: number) => fetchWithAuth(`/cleaner/schedule/${id}`, { method: 'DELETE' }),
};

// Supplier API
export interface Supplier {
  SupplierID: number;
  Name: string;
  Category?: string;
  Rating: number;
  Phone?: string;
  ContactPerson?: string;
  Status: string;
}

export interface SupplierOrderItem {
  ItemID: number;
  OrderID: number;
  ProductName: string;
  Quantity: number;
  Unit: string;
  Price: number;
}

export interface SupplierOrder {
  OrderID: number;
  SupplierID: number;
  Status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  Total: number;
  OrderDate: string;
  DeliveryDate?: string;
  items?: SupplierOrderItem[];
}

export interface SupplierChatMessage {
  MessageID: number;
  SupplierID: number;
  UserID?: number;
  Role: 'user' | 'assistant';
  Content: string;
  CreatedAt: string;
  IsRead: number;
}

export const supplierApi = {
  getSuppliers: () => fetchWithAuth('/suppliers'),
  getOrders: () => fetchWithAuth('/suppliers/orders'),
  createOrder: (data: {
    supplierId: number;
    items: { productName: string; quantity: number; unit?: string; price: number }[];
    deliveryDate?: string;
  }) =>
    fetchWithAuth('/suppliers/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateOrderStatus: (id: number, status: string) =>
    fetchWithAuth(`/suppliers/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  getChat: (supplierId: number) => fetchWithAuth(`/suppliers/chat/${supplierId}`),
  sendMessage: (data: {
    supplierId: number;
    message: string;
    supplierName?: string;
  }) =>
    fetchWithAuth('/suppliers/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  markRead: (messageId: number) =>
    fetchWithAuth(`/suppliers/chat/read/${messageId}`, { method: 'PUT' }),
};

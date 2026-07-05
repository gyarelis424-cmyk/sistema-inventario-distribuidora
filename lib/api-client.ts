const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiError {
  success: false;
  message: string;
  error?: any;
  timestamp: string;
}

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

let authToken: string | null = null;

if (typeof window !== 'undefined') {
  authToken = localStorage.getItem('authToken');
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Error en la solicitud',
        error: data.error,
        timestamp: new Date().toISOString(),
      };
    }

    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Error de conexión con el servidor',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    };
  }
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiCall<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  users: {
    getAll: () => apiCall<any[]>('/users'),
    getById: (id: number) => apiCall<any>(`/users/${id}`),
    create: (data: any) =>
      apiCall<any>('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) =>
      apiCall<any>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiCall<void>(`/users/${id}`, { method: 'DELETE' }),
  },
  products: {
    getAll: (page = 1, limit = 10) =>
      apiCall<any>(`/products?page=${page}&limit=${limit}`),
    getById: (id: number) => apiCall<any>(`/products/${id}`),
    search: (query: string) =>
      apiCall<any[]>(`/products/search?q=${query}`),
    create: (data: any) =>
      apiCall<any>('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) =>
      apiCall<any>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  entries: {
    getAll: (page = 1) => apiCall<any>(`/entries?page=${page}`),
    getById: (id: number) => apiCall<any>(`/entries/${id}`),
    create: (data: any) =>
      apiCall<any>('/entries', { method: 'POST', body: JSON.stringify(data) }),
  },
  exits: {
    getAll: (page = 1) => apiCall<any>(`/exits?page=${page}`),
    getById: (id: number) => apiCall<any>(`/exits/${id}`),
    create: (data: any) =>
      apiCall<any>('/exits', { method: 'POST', body: JSON.stringify(data) }),
  },
  configuration: {
    get: () => apiCall<any>('/configuration'),
    update: (data: any) =>
      apiCall<any>('/configuration', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  dashboard: {
    getStats: () => apiCall<any>('/dashboard/stats'),
    getMovements: (months = 6) =>
      apiCall<any>(`/dashboard/movements?months=${months}`),
  },
};

export function setAuthToken(token: string) {
  authToken = token;
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
}

export function clearAuthToken() {
  authToken = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}

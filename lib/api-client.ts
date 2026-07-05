const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const nameEQ = 'token=';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
}

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

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getTokenFromCookie();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
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
      apiCall<{ token: string; user: any }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },
  users: {
    getAll: () => apiCall<any[]>('/api/users'),
    getById: (id: number) => apiCall<any>(`/api/users/${id}`),
    create: (data: any) =>
      apiCall<any>('/api/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) =>
      apiCall<any>(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      apiCall<void>(`/api/users/${id}`, { method: 'DELETE' }),
  },
  products: {
    getAll: (page = 1, limit = 10) =>
      apiCall<any>(`/api/products?page=${page}&limit=${limit}`),
    getById: (id: number) => apiCall<any>(`/api/products/${id}`),
    search: (query: string) =>
      apiCall<any[]>(`/api/products/search?q=${query}`),
    create: (data: any) =>
      apiCall<any>('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) =>
      apiCall<any>(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  entries: {
    getAll: (page = 1) => apiCall<any>(`/api/entries?page=${page}`),
    getById: (id: number) => apiCall<any>(`/api/entries/${id}`),
    create: (data: any) =>
      apiCall<any>('/api/entries', { method: 'POST', body: JSON.stringify(data) }),
  },
  exits: {
    getAll: (page = 1) => apiCall<any>(`/api/exits?page=${page}`),
    getById: (id: number) => apiCall<any>(`/api/exits/${id}`),
    create: (data: any) =>
      apiCall<any>('/api/exits', { method: 'POST', body: JSON.stringify(data) }),
  },
  configuration: {
    get: () => apiCall<any>('/api/configuration'),
    update: (data: any) =>
      apiCall<any>('/api/configuration', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },
  dashboard: {
    getStats: () => apiCall<any>('/api/dashboard/stats'),
    getMovements: (months = 6) =>
      apiCall<any>(`/api/dashboard/movements?months=${months}`),
  },
};
/**
 * Centralized API Client for NestJS Backend
 * ONLY this file should communicate with the backend
 * All frontend calls should use these exported functions
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ApiResponse<T> {
  data?: T;
  meta?: {
    total: number;
    page: number;
    lastPage: number;
  };
  message?: string;
  statusCode?: number;
}

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Generic API call function
 */
async function apiCall<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  body?: any,
  options: { headers?: Record<string, string> } = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(response.status, data.message || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error instanceof Error ? error.message : 'Unknown error');
  }
}

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export async function loginUser(email: string, password: string) {
  const response = await apiCall<{ token: string; user: any }>('POST', '/api/auth/login', {
    email,
    password,
  });
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
}

export async function refreshToken(token: string) {
  const response = await apiCall<{ token: string; user: any }>('POST', '/api/auth/refresh', {
    token,
  });
  if (response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
}

export function logoutUser() {
  localStorage.removeItem('token');
}

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================

export async function getDashboardStats() {
  const response = await apiCall<any>('GET', '/api/dashboard/stats');
  return response.data || response;
}

// ============================================================================
// PRODUCTS ENDPOINTS
// ============================================================================

export async function getProducts(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  categoryId: string = '',
  status: string = ''
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    categoryId,
    status,
  });
  const response = await apiCall<any>('GET', `/api/products?${params}`);
  return response;
}

export async function getProductById(id: string) {
  const response = await apiCall<any>('GET', `/api/products/${id}`);
  return response.data || response;
}

export async function getProductsByCategory(categoryId: string, page: number = 1, limit: number = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await apiCall<any>('GET', `/api/products/category/${categoryId}?${params}`);
  return response;
}

export async function createProduct(data: {
  code: string;
  name: string;
  price: number;
  categoryId: string;
  unitId: string;
  minimumStock: number;
  description?: string;
  imageUrl?: string;
}) {
  const response = await apiCall<any>('POST', '/api/products', data);
  return response.data || response;
}

export async function updateProduct(id: string, data: any) {
  const response = await apiCall<any>('PUT', `/api/products/${id}`, data);
  return response.data || response;
}

export async function deleteProduct(id: string) {
  const response = await apiCall<any>('DELETE', `/api/products/${id}`);
  return response.data || response;
}

// ============================================================================
// ENTRIES (INVENTARIO ENTRADA)
// ============================================================================

export async function getEntries(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  supplierId: string = ''
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    supplierId,
  });
  const response = await apiCall<any>('GET', `/api/entries?${params}`);
  return response;
}

export async function getEntryById(id: string) {
  const response = await apiCall<any>('GET', `/api/entries/${id}`);
  return response.data || response;
}

export async function createEntry(data: {
  supplierId: string;
  documentNumber: string;
  entryDate: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
}) {
  const response = await apiCall<any>('POST', '/api/entries', data);
  return response.data || response;
}

export async function updateEntry(id: string, data: any) {
  const response = await apiCall<any>('PUT', `/api/entries/${id}`, data);
  return response.data || response;
}

export async function deleteEntry(id: string) {
  const response = await apiCall<any>('DELETE', `/api/entries/${id}`);
  return response.data || response;
}

// ============================================================================
// EXITS (INVENTARIO SALIDA)
// ============================================================================

export async function getExits(
  page: number = 1,
  limit: number = 10,
  search: string = '',
  clientId: string = ''
) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    clientId,
  });
  const response = await apiCall<any>('GET', `/api/exits?${params}`);
  return response;
}

export async function getExitById(id: string) {
  const response = await apiCall<any>('GET', `/api/exits/${id}`);
  return response.data || response;
}

export async function createExit(data: {
  clientId: string;
  documentNumber: string;
  exitDate: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number }>;
}) {
  const response = await apiCall<any>('POST', '/api/exits', data);
  return response.data || response;
}

export async function updateExit(id: string, data: any) {
  const response = await apiCall<any>('PUT', `/api/exits/${id}`, data);
  return response.data || response;
}

export async function deleteExit(id: string) {
  const response = await apiCall<any>('DELETE', `/api/exits/${id}`);
  return response.data || response;
}

// ============================================================================
// CATEGORIES
// ============================================================================

export async function getCategories(page: number = 1, limit: number = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await apiCall<any>('GET', `/api/categories?${params}`);
  return response;
}

export async function getActiveCategories() {
  const response = await apiCall<any>('GET', '/api/categories/active');
  return Array.isArray(response) ? response : response.data || response;
}

export async function getCategoryById(id: string) {
  const response = await apiCall<any>('GET', `/api/categories/${id}`);
  return response.data || response;
}

export async function createCategory(name: string, description?: string) {
  const response = await apiCall<any>('POST', '/api/categories', { name, description });
  return response.data || response;
}

export async function updateCategory(id: string, name: string, description?: string) {
  const response = await apiCall<any>('PUT', `/api/categories/${id}`, { name, description });
  return response.data || response;
}

export async function deleteCategory(id: string) {
  const response = await apiCall<any>('DELETE', `/api/categories/${id}`);
  return response.data || response;
}

// ============================================================================
// SUPPLIERS
// ============================================================================

export async function getSuppliers(page: number = 1, limit: number = 10, search: string = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  });
  const response = await apiCall<any>('GET', `/api/suppliers?${params}`);
  return response;
}

export async function getActiveSuppliers() {
  const response = await apiCall<any>('GET', '/api/suppliers/active');
  return Array.isArray(response) ? response : response.data || response;
}

export async function createSupplier(name: string, email: string, phone: string) {
  const response = await apiCall<any>('POST', '/api/suppliers', { name, email, phone });
  return response.data || response;
}

export async function updateSupplier(id: string, name: string, email: string, phone: string) {
  const response = await apiCall<any>('PUT', `/api/suppliers/${id}`, { name, email, phone });
  return response.data || response;
}

export async function deleteSupplier(id: string) {
  const response = await apiCall<any>('DELETE', `/api/suppliers/${id}`);
  return response.data || response;
}

// ============================================================================
// CLIENTS
// ============================================================================

export async function getClients(page: number = 1, limit: number = 10, search: string = '') {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
  });
  const response = await apiCall<any>('GET', `/api/clients?${params}`);
  return response;
}

export async function getActiveClients() {
  const response = await apiCall<any>('GET', '/api/clients/active');
  return Array.isArray(response) ? response : response.data || response;
}

export async function createClient(name: string, email: string, phone: string) {
  const response = await apiCall<any>('POST', '/api/clients', { name, email, phone });
  return response.data || response;
}

export async function updateClient(id: string, name: string, email: string, phone: string) {
  const response = await apiCall<any>('PUT', `/api/clients/${id}`, { name, email, phone });
  return response.data || response;
}

export async function deleteClient(id: string) {
  const response = await apiCall<any>('DELETE', `/api/clients/${id}`);
  return response.data || response;
}

// ============================================================================
// USERS
// ============================================================================

export async function getUsers(page: number = 1, limit: number = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await apiCall<any>('GET', `/api/users?${params}`);
  return response;
}

export async function getUserById(id: string) {
  const response = await apiCall<any>('GET', `/api/users/${id}`);
  return response.data || response;
}

export async function createUser(email: string, names: string, phone: string) {
  const response = await apiCall<any>('POST', '/api/users', { email, names, phone });
  return response.data || response;
}

export async function updateUser(id: string, names: string, phone: string) {
  const response = await apiCall<any>('PUT', `/api/users/${id}`, { names, phone });
  return response.data || response;
}

export async function deleteUser(id: string) {
  const response = await apiCall<any>('DELETE', `/api/users/${id}`);
  return response.data || response;
}

// ============================================================================
// UNITS
// ============================================================================

export async function getUnits(page: number = 1, limit: number = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await apiCall<any>('GET', `/api/units?${params}`);
  return response;
}

export async function getActiveUnits() {
  const response = await apiCall<any>('GET', '/api/units/active');
  return Array.isArray(response) ? response : response.data || response;
}

export async function createUnit(name: string, abbreviation: string) {
  const response = await apiCall<any>('POST', '/api/units', { name, abbreviation });
  return response.data || response;
}

export async function updateUnit(id: string, name: string, abbreviation: string) {
  const response = await apiCall<any>('PUT', `/api/units/${id}`, { name, abbreviation });
  return response.data || response;
}

export async function deleteUnit(id: string) {
  const response = await apiCall<any>('DELETE', `/api/units/${id}`);
  return response.data || response;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

export async function getConfiguration() {
  const response = await apiCall<any>('GET', '/api/configuration');
  return response.data || response;
}

export async function updateConfiguration(data: any) {
  const response = await apiCall<any>('PUT', '/api/configuration', data);
  return response.data || response;
}

// ============================================================================
// AUDIT
// ============================================================================

export async function getAuditLogs(page: number = 1, limit: number = 10) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  const response = await apiCall<any>('GET', `/api/audit/logs?${params}`);
  return response;
}

export { ApiError };

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'API Error');
  }

  return response.json();
}

export async function getProducts(page = 1, limit = 10, search = '', categoryId = '') {
  return apiCall(`/api/products?page=${page}&limit=${limit}&search=${search}&categoryId=${categoryId}`);
}

export async function getProductById(id: string) {
  return apiCall(`/api/products/${id}`);
}

export async function createProduct(data: any) {
  return apiCall('/api/products', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateProduct(id: string, data: any) {
  return apiCall(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteProduct(id: string) {
  return apiCall(`/api/products/${id}`, { method: 'DELETE' });
}

export async function getCategories() {
  return apiCall('/api/categories/active');
}

export async function getUnits() {
  return apiCall('/api/units/active');
}

export async function getSuppliers(search = '') {
  return apiCall(`/api/suppliers/active?search=${search}`);
}

export async function getClients(search = '') {
  return apiCall(`/api/clients/active?search=${search}`);
}

export async function getEntries(page = 1, limit = 10, search = '', supplierId = '') {
  return apiCall(`/api/entries?page=${page}&limit=${limit}&search=${search}&supplierId=${supplierId}`);
}

export async function getEntryById(id: string) {
  return apiCall(`/api/entries/${id}`);
}

export async function createEntry(data: any) {
  return apiCall('/api/entries', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteEntry(id: string) {
  return apiCall(`/api/entries/${id}`, { method: 'DELETE' });
}

export async function getExits(page = 1, limit = 10, search = '', clientId = '') {
  return apiCall(`/api/exits?page=${page}&limit=${limit}&search=${search}&clientId=${clientId}`);
}

export async function getExitById(id: string) {
  return apiCall(`/api/exits/${id}`);
}

export async function createExit(data: any) {
  return apiCall('/api/exits', { method: 'POST', body: JSON.stringify(data) });
}

export async function deleteExit(id: string) {
  return apiCall(`/api/exits/${id}`, { method: 'DELETE' });
}

export async function getDashboardStats() {
  return Promise.all([
    apiCall('/api/products/stats/total'),
    apiCall('/api/products/stats/stock'),
    apiCall('/api/products/stats/by-category'),
    apiCall('/api/entries/stats/total-monthly'),
    apiCall('/api/exits/stats/total-monthly'),
    apiCall('/api/entries/stats/monthly'),
    apiCall('/api/exits/stats/monthly'),
  ]);
}

export async function getUsers(page = 1, limit = 10) {
  return apiCall(`/api/users?page=${page}&limit=${limit}`);
}

export async function getUserById(id: string) {
  return apiCall(`/api/users/${id}`);
}

export async function createUser(data: any) {
  return apiCall('/api/users', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateUser(id: string, data: any) {
  return apiCall(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteUser(id: string) {
  return apiCall(`/api/users/${id}`, { method: 'DELETE' });
}

export async function getConfiguration() {
  return apiCall('/api/configuration');
}

export async function updateConfiguration(data: any) {
  return apiCall('/api/configuration', { method: 'PUT', body: JSON.stringify(data) });
}

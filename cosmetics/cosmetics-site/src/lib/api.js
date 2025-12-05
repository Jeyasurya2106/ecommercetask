// src/lib/api.js
// API Configuration

export const API_BASE_URL = 'http://localhost:4000/api';

// Auth Helper Functions
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('user', JSON.stringify(user));
};

// API Request Helper
const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const register = async (userData) => {
  const data = await apiRequest(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
  
  if (data.token) {
    setAuthToken(data.token);
    setUser(data.user);
  }
  
  return data;
};

export const login = async (credentials) => {
  const data = await apiRequest(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  if (data.token) {
    setAuthToken(data.token);
    setUser(data.user);
  }
  
  return data;
};

export const logout = () => {
  removeAuthToken();
  window.location.href = '/';
};

// Categories API
export const fetchCategories = async () => {
  try {
    const data = await apiRequest(`${API_BASE_URL}/categories`);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchCategoriesWithProducts = async () => {
  try {
    const data = await apiRequest(`${API_BASE_URL}/categories/with-products`);
    return data;
  } catch (error) {
    console.error('Error fetching categories with products:', error);
    return [];
  }
};

export const createCategory = async (categoryData) => {
  return await apiRequest(`${API_BASE_URL}/categories`, {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
};

// Products API
export const fetchProducts = async (categoryId = null) => {
  try {
    let url = `${API_BASE_URL}/products`;
    if (categoryId) {
      url += `?categoryId=${categoryId}`;
    }
    const data = await apiRequest(url);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductById = async (productId) => {
  try {
    const data = await apiRequest(`${API_BASE_URL}/products/${productId}`);
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createProduct = async (productData) => {
  return await apiRequest(`${API_BASE_URL}/products`, {
    method: 'POST',
    body: JSON.stringify(productData),
  });
};

// Orders API
export const createOrder = async (orderData) => {
  return await apiRequest(`${API_BASE_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const fetchMyOrders = async () => {
  try {
    const data = await apiRequest(`${API_BASE_URL}/orders`);
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const fetchAllOrders = async () => {
  try {
    const data = await apiRequest(`${API_BASE_URL}/orders/admin`);
    return data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    return [];
  }
};
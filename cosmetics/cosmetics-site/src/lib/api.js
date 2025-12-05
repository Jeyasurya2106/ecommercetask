// src/lib/api.js
// API Configuration - Change these endpoints to match your backend

export const API_BASE_URL = 'https://your-api-domain.com/api';

export const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/categories`,
  products: `${API_BASE_URL}/products`,
  productsByCategory: (categoryId) => `${API_BASE_URL}/products?category=${categoryId}`,
  productDetail: (productId) => `${API_BASE_URL}/products/${productId}`,
  cart: `${API_BASE_URL}/cart`,
  orders: `${API_BASE_URL}/orders`,
  createOrder: `${API_BASE_URL}/orders/create`,
};

// Mock Data (Remove when API is ready)
export const mockCategories = [
  { 
    id: 1, 
    name: 'Face', 
    slug: 'face', 
    image: '🧴', 
    subcategories: ['Face Wash', 'Face Cream', 'Face Serum', 'Face Mask'] 
  },
  { 
    id: 2, 
    name: 'Hair', 
    slug: 'hair', 
    image: '💇', 
    subcategories: ['Shampoo', 'Conditioner', 'Hair Oil', 'Hair Mask'] 
  },
  { 
    id: 3, 
    name: 'Body', 
    slug: 'body', 
    image: '🧼', 
    subcategories: ['Body Wash', 'Body Lotion', 'Body Scrub', 'Body Oil'] 
  },
  { 
    id: 4, 
    name: 'Baby', 
    slug: 'baby', 
    image: '👶', 
    subcategories: ['Baby Wash', 'Baby Lotion', 'Baby Oil', 'Diapers'] 
  },
];

export const mockProducts = [
  { 
    id: 1, 
    name: 'Vitamin C Face Wash', 
    category: 1, 
    subcategory: 'Face Wash', 
    price: 299, 
    image: '🍊', 
    rating: 4.5, 
    reviews: 1200, 
    description: 'Brightening face wash with Vitamin C that helps reduce dark spots and gives you radiant skin.' 
  },
  { 
    id: 2, 
    name: 'Onion Hair Oil', 
    category: 2, 
    subcategory: 'Hair Oil', 
    price: 599, 
    image: '🧅', 
    rating: 4.7, 
    reviews: 2500, 
    description: 'Reduces hair fall and promotes growth with natural onion extracts and essential oils.' 
  },
  { 
    id: 3, 
    name: 'Ubtan Face Mask', 
    category: 1, 
    subcategory: 'Face Mask', 
    price: 399, 
    image: '✨', 
    rating: 4.6, 
    reviews: 980, 
    description: 'Traditional ubtan formula for glowing skin with turmeric and sandalwood.' 
  },
  { 
    id: 4, 
    name: 'Tea Tree Shampoo', 
    category: 2, 
    subcategory: 'Shampoo', 
    price: 449, 
    image: '🌿', 
    rating: 4.4, 
    reviews: 1500, 
    description: 'Anti-dandruff formula with tea tree oil that cleanses and soothes the scalp.' 
  },
  { 
    id: 5, 
    name: 'Rose Body Lotion', 
    category: 3, 
    subcategory: 'Body Lotion', 
    price: 349, 
    image: '🌹', 
    rating: 4.5, 
    reviews: 800, 
    description: 'Hydrating rose-infused lotion that leaves skin soft and fragrant all day.' 
  },
  { 
    id: 6, 
    name: 'Baby Moisturizing Lotion', 
    category: 4, 
    subcategory: 'Baby Lotion', 
    price: 299, 
    image: '🍼', 
    rating: 4.8, 
    reviews: 1800, 
    description: 'Gentle moisturizer for babies with natural ingredients and no harmful chemicals.' 
  },
  { 
    id: 7, 
    name: 'Charcoal Face Scrub', 
    category: 1, 
    subcategory: 'Face Scrub', 
    price: 349, 
    image: '⚫', 
    rating: 4.3, 
    reviews: 650, 
    description: 'Deep cleansing charcoal scrub that removes impurities and dead skin cells.' 
  },
  { 
    id: 8, 
    name: 'Argan Hair Serum', 
    category: 2, 
    subcategory: 'Hair Serum', 
    price: 499, 
    image: '💧', 
    rating: 4.6, 
    reviews: 1100, 
    description: 'Nourishing argan oil serum for smooth, frizz-free hair with natural shine.' 
  },
];

// API Functions
export const fetchCategories = async () => {
  try {
    // Uncomment when API is ready:
    // const response = await fetch(API_ENDPOINTS.categories);
    // if (!response.ok) throw new Error('Failed to fetch categories');
    // return await response.json();
    
    // Using mock data for now
    return mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return mockCategories;
  }
};

export const fetchProducts = async (categoryId = null, subcategory = null) => {
  try {
    // Uncomment when API is ready:
    // const url = categoryId 
    //   ? API_ENDPOINTS.productsByCategory(categoryId) 
    //   : API_ENDPOINTS.products;
    // const response = await fetch(url);
    // if (!response.ok) throw new Error('Failed to fetch products');
    // return await response.json();
    
    // Using mock data for now
    let filtered = mockProducts;
    if (categoryId) {
      filtered = filtered.filter(p => p.category === parseInt(categoryId));
    }
    if (subcategory) {
      filtered = filtered.filter(p => p.subcategory === subcategory);
    }
    return filtered;
  } catch (error) {
    console.error('Error fetching products:', error);
    return mockProducts;
  }
};

export const fetchProductById = async (productId) => {
  try {
    // Uncomment when API is ready:
    // const response = await fetch(API_ENDPOINTS.productDetail(productId));
    // if (!response.ok) throw new Error('Failed to fetch product');
    // return await response.json();
    
    // Using mock data for now
    return mockProducts.find(p => p.id === parseInt(productId));
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

export const createOrder = async (orderData) => {
  try {
    // Uncomment when API is ready:
    // const response = await fetch(API_ENDPOINTS.createOrder, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(orderData)
    // });
    // if (!response.ok) throw new Error('Failed to create order');
    // return await response.json();
    
    // Mock response for now
    return {
      id: Date.now(),
      ...orderData,
      orderDate: new Date().toISOString(),
      status: 'confirmed'
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    // Uncomment when API is ready:
    // const response = await fetch(API_ENDPOINTS.orders);
    // if (!response.ok) throw new Error('Failed to fetch orders');
    // return await response.json();
    
    // Return from localStorage for now
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};
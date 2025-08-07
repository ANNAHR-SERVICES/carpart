import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signIn: (credentials) => api.post('/auth/signin', credentials),
  signUp: (userData) => api.post('/auth/signup', userData),
  createUser: (userData) => api.post('/auth/create-user', userData),
};

export const productsAPI = {
  // Récupérer tous les produits avec filtres
  getProducts: (params = {}) => api.get('/vendeur/pieces', { params }),
  
  // Récupérer un produit spécifique
  getProduct: (id) => api.get(`/vendeur/pieces/${id}`),
  
  // Créer un nouveau produit
  createProduct: (productData) => api.post('/vendeur/pieces', productData),
  
  // Modifier un produit
  updateProduct: (id, productData) => api.put(`/vendeur/pieces/${id}`, productData),
  
  // Supprimer un produit
  deleteProduct: (id) => api.delete(`/vendeur/pieces/${id}`),
  
  // Rechercher des produits
  searchProducts: (query) => api.get(`/vendeur/pieces/search/${query}`),
  
  // Produits par catégorie
  getProductsByCategory: (category) => api.get(`/vendeur/pieces/categorie/${category}`),
};

export default api; 
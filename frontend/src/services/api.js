import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Never force a redirect for auth attempts themselves (login/register).
    // A failed login returns 401 with invalid credentials, and should surface
    // its error inline instead of reloading the page and wiping the token/error.
    const url = error.config?.url || '';
    const isAuthCall = url.includes('/auth/login') || url.includes('/auth/register');

    if (error.response?.status === 401 && !isAuthCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getUser: (userId) => api.get(`/auth/user/${userId}`),
};

// Prediction APIs
export const predictionAPI = {
  predict: (formData) => {
    return api.post('/prediction/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getHistory: (page = 1, perPage = 10) => {
    return api.get(`/prediction/history?page=${page}&per_page=${perPage}`);
  },
  getPredictionDetails: (predictionId) => {
    return api.get(`/prediction/prediction/${predictionId}`);
  },
  downloadReport: (predictionId) => {
    return api.get(`/prediction/report/${predictionId}`, {
      responseType: 'blob',
    });
  },
  getStats: () => api.get('/prediction/stats'),
  getModelInfo: () => api.get('/prediction/model-info'),
};

// Chatbot API
export const chatbotAPI = {
  send: (message) => api.post('/chatbot/chat', { message }),
};

export default api;

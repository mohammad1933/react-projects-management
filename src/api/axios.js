import axios from 'axios';

// All API calls go through this instance
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Laravel backend
  headers: {
    // 'Content-Type': 'application/json',
    // 'Accept':       'application/json', // tells Laravel to return JSON errors
  },
});

// ── Request Interceptor ──────────────────────────────────
// Before every request, attach the Bearer token if we have one
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

   if (!(config.data instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }
  return config;
});

// ── Response Interceptor ─────────────────────────────────
// If we get a 401, the token is invalid/expired — log the user out
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login'; // force redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
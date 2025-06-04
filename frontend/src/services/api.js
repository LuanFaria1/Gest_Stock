import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição para incluir o token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de resposta para tratar erros de autenticação
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isTokenExpired =
      error.response?.status === 401 &&
      error.response?.data?.msg === 'Token has expired';

    if (isTokenExpired) {
      // Limpa o localStorage e recarrega para forçar login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;

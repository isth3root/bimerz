import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_DEV_URI,
  withCredentials: true,
  timeout: 10000, // 10 second global timeout
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 - let components handle it
    if (error.response?.status === 401) {
      console.log('Unauthorized - not redirecting');
      // We'll handle this in the AuthContext
    }
    return Promise.reject(error);
  }
);

export default api;
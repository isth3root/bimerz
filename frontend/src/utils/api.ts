import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_DEV_URI,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - not redirecting');
    }
    return Promise.reject(error);
  }
);

export default api;
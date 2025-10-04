import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_DEV_URI,
  withCredentials: true,
});

export default api;
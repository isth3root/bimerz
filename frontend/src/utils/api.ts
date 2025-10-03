import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.DEV_URI,
});

export default api;
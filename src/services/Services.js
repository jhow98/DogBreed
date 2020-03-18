import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dogbreed-api.q9.com.br/',
  headers: {'Content-Type': 'application/json'},
});

export default api;

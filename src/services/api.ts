import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api-node-fastfy.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
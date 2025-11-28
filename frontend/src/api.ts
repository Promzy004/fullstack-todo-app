// api.ts
import axios from "axios";

// // Base URL of your server
// const API_URL = ""; 

// Create axios instance
const api = axios.create({
  // baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default api;

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


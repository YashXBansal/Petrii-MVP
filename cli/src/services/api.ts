import axios from "axios";
import type { User } from "../types";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Use an interceptor to add the auth token to every request
api.interceptors.request.use((config) => {
  try {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user: User = JSON.parse(userString);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (error) {
    console.error("Could not parse user from localStorage", error);
  }
  return config;
});

export default api;

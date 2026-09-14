import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const url = config.url || "";
  const method = (config.method || "get").toLowerCase();
  const adminToken = localStorage.getItem("typerider_admin_token");
  const userToken = localStorage.getItem("typerider_token");
  const needsAdmin = url.startsWith("/admin") || (url.startsWith("/topics") && method !== "get");
  const token = needsAdmin ? adminToken : userToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url || "";
      if (url.startsWith("/admin")) {
        localStorage.removeItem("typerider_admin_token");
        localStorage.removeItem("typerider_admin");
        window.location.href = "/admin/login";
      } else {
        localStorage.removeItem("typerider_token");
        localStorage.removeItem("typerider_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(error) {
  return (
    error.response?.data?.message ||
    "Something went wrong. Please try again."
  );
}

export default api;

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("typerider_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const raw = localStorage.getItem("typerider_admin");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function boot() {
      const token = localStorage.getItem("typerider_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await api.get("/auth/profile");
        setUser(data.user);
        localStorage.setItem("typerider_user", JSON.stringify(data.user));
      } catch {
        localStorage.removeItem("typerider_token");
        localStorage.removeItem("typerider_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    boot();
  }, []);

  const value = useMemo(
    () => ({
      user,
      admin,
      loading,
      async signup(payload) {
        const { data } = await api.post("/auth/signup", payload);
        localStorage.setItem("typerider_token", data.token);
        localStorage.setItem("typerider_user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      },
      async login(payload) {
        const { data } = await api.post("/auth/login", payload);
        localStorage.setItem("typerider_token", data.token);
        localStorage.setItem("typerider_user", JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
      },
      logout() {
        localStorage.removeItem("typerider_token");
        localStorage.removeItem("typerider_user");
        setUser(null);
      },
      async adminLogin(payload) {
        const { data } = await api.post("/auth/admin/login", payload);
        localStorage.setItem("typerider_admin_token", data.token);
        localStorage.setItem("typerider_admin", JSON.stringify(data.admin));
        setAdmin(data.admin);
        return data.admin;
      },
      adminLogout() {
        localStorage.removeItem("typerider_admin_token");
        localStorage.removeItem("typerider_admin");
        setAdmin(null);
      },
      updateUser(next) {
        setUser(next);
        localStorage.setItem("typerider_user", JSON.stringify(next));
      },
    }),
    [user, admin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

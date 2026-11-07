import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("hiresmart_token")) {
      api.get("/api/auth/me").then(r => setUser(r.data.user))
        .catch(() => localStorage.removeItem("hiresmart_token"))
        .finally(() => setLoading(false));
    } else setLoading(false);
  }, []);
  const login = async (path, payload) => {
    const { data } = await api.post(path, payload);
    localStorage.setItem("hiresmart_token", data.token);
    setUser(data.user);
  };
  const logout = () => { localStorage.removeItem("hiresmart_token"); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);

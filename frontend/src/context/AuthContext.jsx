// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { _id, name, email }
  const [role, setRole] = useState(null); // "user" | "admin"
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // prevent flicker on refresh

  // Load auth from localStorage when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedRole && storedToken) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
      setToken(storedToken);
    }
    setLoading(false); // auth check done
  }, []);

  // login
  const login = (token, role, userData) => {
    setUser(userData);
    setRole(role);
    setToken(token);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", role);
    localStorage.setItem("token", token);
  };

  // logout
  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

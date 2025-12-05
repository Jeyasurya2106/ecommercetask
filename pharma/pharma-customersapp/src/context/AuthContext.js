import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login as loginApi } from "../api/authService";
import { setAuthToken } from "../api/apiClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // load token/user from storage
    async function init() {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        if (savedToken) {
          setToken(savedToken);
          setAuthToken(savedToken);
        }
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.log("Auth init error", e);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const login = async (email, password) => {
    const { token: t, user: u } = await loginApi(email, password);
    setToken(t);
    setUser(u);
    setAuthToken(t);
    await AsyncStorage.setItem("token", t);
    await AsyncStorage.setItem("user", JSON.stringify(u));
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

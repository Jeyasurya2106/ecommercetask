import api from "./apiClient";

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  const { token, user } = res.data;
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

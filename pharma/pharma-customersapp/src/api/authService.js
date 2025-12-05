import api, { setAuthToken } from "./apiClient";

export async function login(email, password) {
  const res = await api.post("/auth/login", { email, password });
  const { token, user } = res.data;
  setAuthToken(token);
  return { token, user };
}

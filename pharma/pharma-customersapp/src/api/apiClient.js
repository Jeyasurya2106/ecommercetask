import axios from "axios";

const BASE_URL = "http://192.168.29.87:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;

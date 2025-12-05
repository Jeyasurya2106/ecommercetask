import api from "./apiClient";

export async function getProducts() {
  const res = await api.get("/products");
  return res.data;
}

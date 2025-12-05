import api from "./apiClient";

export async function getProducts(params = {}) {
  const res = await api.get("/products", { params });
  return res.data;
}

export async function createProduct(payload) {
  const res = await api.post("/products", payload);
  return res.data;
}

export async function getProduct(id) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}

import api from "./apiClient";

export async function getCategories() {
  const res = await api.get("/categories");
  return res.data;
}

export async function createCategory(payload) {
  const res = await api.post("/categories", payload);
  return res.data;
}

export async function getCategoriesWithProducts() {
  const res = await api.get("/categories/with-products");
  return res.data;
}

import api from "./apiClient";

export async function getAdminOrders() {
  const res = await api.get("/orders/admin");
  return res.data;
}

export async function getMyOrders() {
  const res = await api.get("/orders");
  return res.data;
}

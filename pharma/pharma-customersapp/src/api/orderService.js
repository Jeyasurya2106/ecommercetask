import api from "./apiClient";

export async function createOrder(items, shippingAddress) {
  const payload = {
    shipping_address: shippingAddress,
    items: items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  };
  const res = await api.post("/orders", payload);
  return res.data; 
}

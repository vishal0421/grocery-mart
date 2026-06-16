import api from "./api";

export const orderService = {
  createOrder: async (shippingAddress, paymentMethod) => {
    const response = await api.post("/api/orders", {
      shippingAddress,
      paymentMethod,
    });

    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get("/api/orders/my-orders");
    return response.data;
  },

  getAllOrders: async () => {
    const response = await api.get("/api/orders/all");
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/api/orders/${orderId}`, { status });
    return response.data;
  },
};

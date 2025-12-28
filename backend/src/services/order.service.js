export class OrderService {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async updateStatus(orderId, status) {
    if (!["pending", "shipped", "delivered"].includes(status)) {
      throw new Error("Invalid status");
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    order.status = status;

    if (status === "shipped" && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (status === "delivered" && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    return order.save();
  }
}
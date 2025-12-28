import { OrderRepository } from "../repositories/order.repository.js";
import { OrderService } from "../services/order.service.js";

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);

export async function getAllOrders(_, res) {
  try {
    const orders = await orderRepository.findAll();
    res.status(200).json({ orders });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const order = await orderService.updateStatus(
      req.params.orderId,
      req.body.status
    );

    res.json({ message: "Order status updated", order });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

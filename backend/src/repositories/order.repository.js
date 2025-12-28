import { Order } from "../models/order.model.js";

export class OrderRepository {
  findAll() {
    return Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
  }

  findById(id) {
    return Order.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product");
  }

  count() {
    return Order.countDocuments();
  }
}

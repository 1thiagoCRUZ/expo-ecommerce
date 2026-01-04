import { Order } from "../models/order.model.js";

export class OrderRepository {
  async findAll() {
    return Order.find()
      .populate("user", "name email")
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
  }

  async findById(id) {
    return Order.findById(id)
      .populate("user", "name email")
      .populate("orderItems.product");
  }

  async findByClerkId(clerkId) {
    return Order.find({ clerkId })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
  }

  async create(data) {
    return Order.create(data);
  }

  async save(order) {
    return order.save();
  }
}
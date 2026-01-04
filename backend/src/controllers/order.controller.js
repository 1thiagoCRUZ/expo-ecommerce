import { OrderRepository } from "../repositories/order.repository.js";
import { ProductRepository } from "../repositories/product.repository.js"; 
import { ReviewRepository } from "../repositories/review.repository.js";
import { OrderService } from "../services/order.service.js";

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository(); 
const reviewRepository = new ReviewRepository();   

const orderService = new OrderService(
  orderRepository, 
  productRepository, 
  reviewRepository
);

export async function getAllOrders(_, res) {
  try {
    const orders = await orderService.getAll();
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createOrder(req, res) {
  try {

    const order = await orderService.createOrder(req.user, req.body);
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    if (error.message.includes("Insufficient stock") || error.message.includes("No order items")) {
        return res.status(400).json({ error: error.message });
    }
    console.error("Error in createOrder:", error);
    res.status(500).json({ error: "Internal server error" });
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

export async function getUserOrders(req, res) {
  try {
    const orders = await orderService.getUserOrders(req.user.clerkId);
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
import { ReviewRepository } from "../repositories/review.repository.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { ReviewService } from "../services/review.service.js";

const reviewService = new ReviewService(
  new ReviewRepository(),
  new OrderRepository(),
  new ProductRepository()
);

export async function createReview(req, res) {
  try {
    const review = await reviewService.submitReview(req.user, req.body);
    
    res.status(201).json({ 
      message: "Review submitted successfully", 
      review 
    });

  } catch (error) {
    console.error("Error in createReview controller:", error);
    const errorMessage = error.message;

    if (errorMessage === "Order not found" || errorMessage === "Product not found (Rollback)") {
      return res.status(404).json({ error: errorMessage });
    }
    
    if (errorMessage === "Not authorized to review this order") {
      return res.status(403).json({ error: errorMessage });
    }

    if (
      errorMessage === "Rating must be between 1 and 5" || 
      errorMessage === "Can only review delivered orders" ||
      errorMessage === "Product not found in this order"
    ) {
      return res.status(400).json({ error: errorMessage });
    }

    // Erro genérico
    res.status(500).json({ error: "Internal server error" });
  }
}
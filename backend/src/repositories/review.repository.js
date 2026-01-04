import { Review } from "../models/review.model.js";

export class ReviewRepository {
  
  async findByOrderIds(orderIds) {
    return Review.find({ orderId: { $in: orderIds } });
  }

  async create(data) {
    return Review.create(data);
  }
}
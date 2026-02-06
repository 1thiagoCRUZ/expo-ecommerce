import { Review } from "../models/review.model.js";

export class ReviewRepository {
  async create(data) {
    return Review.create(data);
  }

  async findByOrderIds(orderIds) {
    return Review.find({ orderId: { $in: orderIds } });
  }

  async findByProductId(productId) {
    return Review.find({ product: productId }).sort({ createdAt: -1 });
  }

  async findOne(query) {
    return Review.findOne(query);
  }
  async upsert(userId, productId, data) {
    return Review.findOneAndUpdate(
      { productId, userId },
      data,
      { new: true, upsert: true, runValidators: true }
    );
  }

  async findById(id) {
    return Review.findById(id);
  }

  async remove(review) {
    return review.deleteOne();
  }
}
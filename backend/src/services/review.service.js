export class ReviewService {
  constructor(reviewRepository, orderRepository, productRepository) {
    this.reviewRepository = reviewRepository;
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
  }

  async submitReview(user, reviewData) {
    const { productId, orderId, rating } = reviewData;
    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    if (order.clerkId !== user.clerkId) {
      throw new Error("Not authorized to review this order");
    }
    if (order.status !== "delivered") {
      throw new Error("Can only review delivered orders");
    }

    const productInOrder = order.orderItems.find(
      (item) => item.product.toString() === productId.toString()
    );

    if (!productInOrder) {
      throw new Error("Product not found in this order");
    }
    const review = await this.reviewRepository.upsert(
      user._id, 
      productId, 
      {
        rating,
        orderId,
        productId,
        userId: user._id
      }
    );

    const reviews = await this.reviewRepository.findByProductId(productId);
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);

    const updatedProduct = await this.productRepository.updateStats(productId, {
      averageRating: totalRating / reviews.length,
      totalReviews: reviews.length,
    });

    if (!updatedProduct) {
      await this.reviewRepository.deleteById(review._id);
      throw new Error("Product not found (Rollback)");
    }

    return review;
  }
}
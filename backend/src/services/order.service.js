export class OrderService {
  constructor(orderRepository, productRepository, reviewRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.reviewRepository = reviewRepository;
  }

  async getAll() {
    return this.orderRepository.findAll();
  }

  async updateStatus(orderId, status) {
    if (!["pending", "shipped", "delivered"].includes(status)) {
      throw new Error("Invalid status");
    }

    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");

    order.status = status;

    if (status === "shipped" && !order.shippedAt) order.shippedAt = new Date();
    if (status === "delivered" && !order.deliveredAt) order.deliveredAt = new Date();

    return this.orderRepository.save(order);
  }

  async createOrder(user, orderData) {
    const { orderItems, shippingAddress, paymentResult, totalPrice } = orderData;

    if (!orderItems || orderItems.length === 0) {
      throw new Error("No order items");
    }

    for (const item of orderItems) {
      const product = await this.productRepository.findById(item.product._id);
      
      if (!product) {
        throw new Error(`Product ${item.name || 'item'} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }


    const order = await this.orderRepository.create({
      user: user._id,
      clerkId: user.clerkId,
      orderItems,
      shippingAddress,
      paymentResult,
      totalPrice,
    });

    for (const item of orderItems) {
      await this.productRepository.decreaseStock(item.product._id, item.quantity);
    }

    return order;
  }

  async getUserOrders(clerkId) {
    const orders = await this.orderRepository.findByClerkId(clerkId);

    const orderIds = orders.map((order) => order._id);
    const reviews = await this.reviewRepository.findByOrderIds(orderIds);
    
    const reviewedOrderIds = new Set(reviews.map((review) => review.orderId.toString()));

    return orders.map((order) => ({
        ...order.toObject(),
        hasReviewed: reviewedOrderIds.has(order._id.toString()),
    }));
  }
}
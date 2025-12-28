import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

export class DashboardService {
  async getStats() {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    const revenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" },
        },
      },
    ]);

    return {
      totalRevenue: revenue[0]?.total || 0,
      totalOrders,
      totalCustomers,
      totalProducts,
    };
  }
}

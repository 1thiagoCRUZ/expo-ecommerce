import { DashboardService } from '../../../src/services/dashboard.service.js';
import { Order } from '../../../src/models/order.model.js';
import { User } from '../../../src/models/user.model.js';
import { Product } from '../../../src/models/product.model.js';

jest.mock('../../../src/models/order.model.js');
jest.mock('../../../src/models/user.model.js');
jest.mock('../../../src/models/product.model.js');

describe('DashboardService', () => {
  let dashboardService;

  beforeEach(() => {
    dashboardService = new DashboardService();
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return complete dashboard statistics', async () => {
      Order.countDocuments.mockResolvedValue(50);
      User.countDocuments.mockResolvedValue(100);
      Product.countDocuments.mockResolvedValue(25);
      Order.aggregate.mockResolvedValue([{ _id: null, total: 15000 }]);

      const result = await dashboardService.getStats();

      expect(result).toEqual({
        totalRevenue: 15000,
        totalOrders: 50,
        totalCustomers: 100,
        totalProducts: 25,
      });
    });

    it('should return zero revenue when no orders exist', async () => {
      Order.countDocuments.mockResolvedValue(0);
      User.countDocuments.mockResolvedValue(10);
      Product.countDocuments.mockResolvedValue(5);
      Order.aggregate.mockResolvedValue([]);

      const result = await dashboardService.getStats();

      expect(result.totalRevenue).toBe(0);
      expect(result.totalOrders).toBe(0);
    });

    it('should handle undefined revenue from aggregate', async () => {
      Order.countDocuments.mockResolvedValue(0);
      User.countDocuments.mockResolvedValue(0);
      Product.countDocuments.mockResolvedValue(0);
      Order.aggregate.mockResolvedValue([{ _id: null, total: undefined }]);

      const result = await dashboardService.getStats();

      expect(result.totalRevenue).toBe(0);
    });

    it('should handle null revenue from aggregate', async () => {
      Order.countDocuments.mockResolvedValue(0);
      User.countDocuments.mockResolvedValue(0);
      Product.countDocuments.mockResolvedValue(0);
      Order.aggregate.mockResolvedValue([{ _id: null, total: null }]);

      const result = await dashboardService.getStats();

      expect(result.totalRevenue).toBe(0);
    });

    it('should call correct aggregation pipeline', async () => {
      Order.countDocuments.mockResolvedValue(0);
      User.countDocuments.mockResolvedValue(0);
      Product.countDocuments.mockResolvedValue(0);
      Order.aggregate.mockResolvedValue([]);

      await dashboardService.getStats();

      expect(Order.aggregate).toHaveBeenCalledWith([
        {
          $group: {
            _id: null,
            total: { $sum: '$totalPrice' },
          },
        },
      ]);
    });

    it('should handle large revenue numbers', async () => {
      Order.countDocuments.mockResolvedValue(1000);
      User.countDocuments.mockResolvedValue(500);
      Product.countDocuments.mockResolvedValue(200);
      Order.aggregate.mockResolvedValue([{ _id: null, total: 999999.99 }]);

      const result = await dashboardService.getStats();

      expect(result.totalRevenue).toBe(999999.99);
    });

    it('should handle zero counts for all metrics', async () => {
      Order.countDocuments.mockResolvedValue(0);
      User.countDocuments.mockResolvedValue(0);
      Product.countDocuments.mockResolvedValue(0);
      Order.aggregate.mockResolvedValue([]);

      const result = await dashboardService.getStats();

      expect(result).toEqual({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
      });
    });
  });
});
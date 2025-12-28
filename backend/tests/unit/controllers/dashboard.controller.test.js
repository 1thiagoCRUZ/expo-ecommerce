import { getDashboardStats } from '../../../src/controllers/dashboard.controller.js';
import { DashboardService } from '../../../src/services/dashboard.service.js';

jest.mock('../../../src/services/dashboard.service.js');

describe('DashboardController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {};

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    it('should return dashboard stats successfully', async () => {
      const mockStats = {
        totalRevenue: 15000,
        totalOrders: 50,
        totalCustomers: 100,
        totalProducts: 25,
      };

      DashboardService.prototype.getStats = jest.fn().mockResolvedValue(mockStats);

      await getDashboardStats(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockStats);
    });

    it('should return 500 error when service fails', async () => {
      DashboardService.prototype.getStats = jest.fn().mockRejectedValue(new Error('Database error'));

      await getDashboardStats(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

    it('should call getStats on service', async () => {
      const mockGetStats = jest.fn().mockResolvedValue({});
      DashboardService.prototype.getStats = mockGetStats;

      await getDashboardStats(mockReq, mockRes);

      expect(mockGetStats).toHaveBeenCalledTimes(1);
    });

    it('should handle stats with zero values', async () => {
      const mockStats = {
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalProducts: 0,
      };

      DashboardService.prototype.getStats = jest.fn().mockResolvedValue(mockStats);

      await getDashboardStats(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockStats);
    });
  });
});
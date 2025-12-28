import { getAllOrders, updateOrderStatus } from '../../../src/controllers/order.controller.js';
import { OrderRepository } from '../../../src/repositories/order.repository.js';
import { OrderService } from '../../../src/services/order.service.js';

jest.mock('../../../src/repositories/order.repository.js');
jest.mock('../../../src/services/order.service.js');

describe('OrderController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      params: {},
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('getAllOrders', () => {
    it('should return all orders successfully', async () => {
      const mockOrders = [
        { _id: '1', totalPrice: 100 },
        { _id: '2', totalPrice: 200 },
      ];

      OrderRepository.prototype.findAll = jest.fn().mockResolvedValue(mockOrders);

      await getAllOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ orders: mockOrders });
    });

    it('should return empty orders array when no orders exist', async () => {
      OrderRepository.prototype.findAll = jest.fn().mockResolvedValue([]);

      await getAllOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ orders: [] });
    });

    it('should return 500 error when repository fails', async () => {
      OrderRepository.prototype.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      await getAllOrders(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      const mockOrder = {
        _id: '123',
        status: 'shipped',
      };

      mockReq.params = { orderId: '123' };
      mockReq.body = { status: 'shipped' };

      OrderService.prototype.updateStatus = jest.fn().mockResolvedValue(mockOrder);

      await updateOrderStatus(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Order status updated',
        order: mockOrder,
      });
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 400 error when service throws error', async () => {
      mockReq.params = { orderId: '123' };
      mockReq.body = { status: 'invalid' };

      OrderService.prototype.updateStatus = jest.fn().mockRejectedValue(new Error('Invalid status'));

      await updateOrderStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid status' });
    });

    it('should pass orderId and status to service', async () => {
      const mockUpdateStatus = jest.fn().mockResolvedValue({});
      OrderService.prototype.updateStatus = mockUpdateStatus;

      mockReq.params = { orderId: '123' };
      mockReq.body = { status: 'delivered' };

      await updateOrderStatus(mockReq, mockRes);

      expect(mockUpdateStatus).toHaveBeenCalledWith('123', 'delivered');
    });

    it('should handle order not found error', async () => {
      mockReq.params = { orderId: '999' };
      mockReq.body = { status: 'shipped' };

      OrderService.prototype.updateStatus = jest.fn().mockRejectedValue(new Error('Order not found'));

      await updateOrderStatus(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Order not found' });
    });
  });
});
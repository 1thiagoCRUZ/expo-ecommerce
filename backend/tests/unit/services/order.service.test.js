import { OrderService } from '../../../src/services/order.service.js';

describe('OrderService', () => {
  let orderService;
  let mockOrderRepository;

  beforeEach(() => {
    mockOrderRepository = {
      findById: jest.fn(),
    };

    orderService = new OrderService(mockOrderRepository);
  });

  describe('updateStatus', () => {
    const orderId = '507f1f77bcf86cd799439011';

    it('should update order status to shipped', async () => {
      const mockOrder = {
        _id: orderId,
        status: 'pending',
        shippedAt: null,
        deliveredAt: null,
        save: jest.fn().mockResolvedValue(this),
      };

      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const result = await orderService.updateStatus(orderId, 'shipped');

      expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(mockOrder.status).toBe('shipped');
      expect(mockOrder.shippedAt).toBeInstanceOf(Date);
      expect(mockOrder.deliveredAt).toBeNull();
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should update order status to delivered', async () => {
      const mockOrder = {
        _id: orderId,
        status: 'shipped',
        shippedAt: new Date(),
        deliveredAt: null,
        save: jest.fn().mockResolvedValue(this),
      };

      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      await orderService.updateStatus(orderId, 'delivered');

      expect(mockOrder.status).toBe('delivered');
      expect(mockOrder.deliveredAt).toBeInstanceOf(Date);
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should update order status to pending', async () => {
      const mockOrder = {
        _id: orderId,
        status: 'shipped',
        shippedAt: new Date(),
        deliveredAt: null,
        save: jest.fn().mockResolvedValue(this),
      };

      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      await orderService.updateStatus(orderId, 'pending');

      expect(mockOrder.status).toBe('pending');
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should throw error for invalid status', async () => {
      await expect(orderService.updateStatus(orderId, 'invalid')).rejects.toThrow(
        'Invalid status'
      );
      expect(mockOrderRepository.findById).not.toHaveBeenCalled();
    });

    it('should throw error for empty status', async () => {
      await expect(orderService.updateStatus(orderId, '')).rejects.toThrow('Invalid status');
    });

    it('should throw error for null status', async () => {
      await expect(orderService.updateStatus(orderId, null)).rejects.toThrow('Invalid status');
    });

    it('should throw error when order not found', async () => {
      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(orderService.updateStatus(orderId, 'shipped')).rejects.toThrow(
        'Order not found'
      );
    });

    it('should not update shippedAt if already set', async () => {
      const existingShippedDate = new Date('2024-01-01');
      const mockOrder = {
        _id: orderId,
        status: 'pending',
        shippedAt: existingShippedDate,
        deliveredAt: null,
        save: jest.fn().mockResolvedValue(this),
      };

      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      await orderService.updateStatus(orderId, 'shipped');

      expect(mockOrder.shippedAt).toEqual(existingShippedDate);
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should not update deliveredAt if already set', async () => {
      const existingDeliveredDate = new Date('2024-01-05');
      const mockOrder = {
        _id: orderId,
        status: 'shipped',
        shippedAt: new Date('2024-01-01'),
        deliveredAt: existingDeliveredDate,
        save: jest.fn().mockResolvedValue(this),
      };

      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      await orderService.updateStatus(orderId, 'delivered');

      expect(mockOrder.deliveredAt).toEqual(existingDeliveredDate);
      expect(mockOrder.save).toHaveBeenCalled();
    });

    it('should handle case-sensitive status validation', async () => {
      await expect(orderService.updateStatus(orderId, 'SHIPPED')).rejects.toThrow(
        'Invalid status'
      );
      await expect(orderService.updateStatus(orderId, 'Pending')).rejects.toThrow(
        'Invalid status'
      );
    });

    it('should not set shippedAt when status is not shipped', async () => {
      const mockOrder = {
        _id: orderId,
        status: 'pending',
        shippedAt: null,
        deliveredAt: null,
        save: jest.fn().mockResolvedValue(this),
      };

      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      await orderService.updateStatus(orderId, 'pending');

      expect(mockOrder.shippedAt).toBeNull();
    });

    it('should not set deliveredAt when status is not delivered', async () => {
      const mockOrder = {
        _id: orderId,
        status: 'pending',
        shippedAt: null,
        deliveredAt: null,
        save: jest.fn().mockResolvedValue(this),
      };

      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      await orderService.updateStatus(orderId, 'shipped');

      expect(mockOrder.deliveredAt).toBeNull();
    });
  });
});
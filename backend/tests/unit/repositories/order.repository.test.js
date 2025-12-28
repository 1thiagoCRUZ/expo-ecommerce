import { OrderRepository } from '../../../src/repositories/order.repository.js';
import { Order } from '../../../src/models/order.model.js';

jest.mock('../../../src/models/order.model.js');

describe('OrderRepository', () => {
  let orderRepository;

  beforeEach(() => {
    orderRepository = new OrderRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all orders with populated fields sorted by createdAt', async () => {
      const mockOrders = [
        { _id: '1', totalPrice: 100, createdAt: new Date('2024-01-02') },
        { _id: '2', totalPrice: 200, createdAt: new Date('2024-01-01') },
      ];

      const mockSort = jest.fn().mockResolvedValue(mockOrders);
      const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      Order.find.mockReturnValue({ populate: mockPopulate1 });

      const result = await orderRepository.findAll();

      expect(Order.find).toHaveBeenCalled();
      expect(mockPopulate1).toHaveBeenCalledWith('user', 'name email');
      expect(mockPopulate2).toHaveBeenCalledWith('orderItems.product');
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockOrders);
    });

    it('should return empty array when no orders exist', async () => {
      const mockSort = jest.fn().mockResolvedValue([]);
      const mockPopulate2 = jest.fn().mockReturnValue({ sort: mockSort });
      const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });
      Order.find.mockReturnValue({ populate: mockPopulate1 });

      const result = await orderRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find order by id', async () => {
      const orderId = '507f1f77bcf86cd799439011';
      const mockOrder = { _id: orderId, totalPrice: 150 };

      Order.findById.mockResolvedValue(mockOrder);

      const result = await orderRepository.findById(orderId);

      expect(Order.findById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });

    it('should return null when order not found', async () => {
      Order.findById.mockResolvedValue(null);

      const result = await orderRepository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('count', () => {
    it('should return order count', async () => {
      Order.countDocuments.mockResolvedValue(25);

      const result = await orderRepository.count();

      expect(Order.countDocuments).toHaveBeenCalled();
      expect(result).toBe(25);
    });

    it('should return zero when no orders exist', async () => {
      Order.countDocuments.mockResolvedValue(0);

      const result = await orderRepository.count();

      expect(result).toBe(0);
    });
  });
});
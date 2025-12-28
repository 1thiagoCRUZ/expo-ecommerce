import { getAllCustomers } from '../../../src/controllers/user.controller.js';
import { UserRepository } from '../../../src/repositories/user.repository.js';

jest.mock('../../../src/repositories/user.repository.js');

describe('UserController', () => {
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

  describe('getAllCustomers', () => {
    it('should return all customers successfully', async () => {
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      ];

      UserRepository.prototype.findAll = jest.fn().mockResolvedValue(mockUsers);

      await getAllCustomers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should return empty array when no customers exist', async () => {
      UserRepository.prototype.findAll = jest.fn().mockResolvedValue([]);

      await getAllCustomers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    it('should return 500 error when repository fails', async () => {
      UserRepository.prototype.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

      await getAllCustomers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });

    it('should call findAll on repository', async () => {
      const mockFindAll = jest.fn().mockResolvedValue([]);
      UserRepository.prototype.findAll = mockFindAll;

      await getAllCustomers(mockReq, mockRes);

      expect(mockFindAll).toHaveBeenCalledTimes(1);
    });
  });
});
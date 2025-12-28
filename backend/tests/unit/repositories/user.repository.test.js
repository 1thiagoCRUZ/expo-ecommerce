import { UserRepository } from '../../../src/repositories/user.repository.js';
import { User } from '../../../src/models/user.model.js';

jest.mock('../../../src/models/user.model.js');

describe('UserRepository', () => {
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all users sorted by createdAt descending', async () => {
      const mockUsers = [
        { _id: '1', name: 'User 1', createdAt: new Date('2024-01-02') },
        { _id: '2', name: 'User 2', createdAt: new Date('2024-01-01') },
      ];

      const mockSort = jest.fn().mockResolvedValue(mockUsers);
      User.find.mockReturnValue({ sort: mockSort });

      const result = await userRepository.findAll();

      expect(User.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      const mockSort = jest.fn().mockResolvedValue([]);
      User.find.mockReturnValue({ sort: mockSort });

      const result = await userRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('count', () => {
    it('should return user count', async () => {
      User.countDocuments.mockResolvedValue(100);

      const result = await userRepository.count();

      expect(User.countDocuments).toHaveBeenCalled();
      expect(result).toBe(100);
    });

    it('should return zero when no users exist', async () => {
      User.countDocuments.mockResolvedValue(0);

      const result = await userRepository.count();

      expect(result).toBe(0);
    });
  });
});
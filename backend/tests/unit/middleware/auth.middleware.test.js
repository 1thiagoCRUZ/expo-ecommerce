import { protectRoute, adminOnly } from '../../../src/middleware/auth.middleware.js';
import { requireAuth } from '@clerk/express';
import { User } from '../../../src/models/user.model.js';
import { ENV } from '../../../src/config/env.js';

jest.mock('@clerk/express');
jest.mock('../../../src/models/user.model.js');
jest.mock('../../../src/config/env.js', () => ({
  ENV: {
    ADMIN_EMAIL: 'admin@test.com',
  },
}));

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      auth: jest.fn(),
      user: null,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('protectRoute', () => {
    it('should be an array with requireAuth and custom middleware', () => {
      expect(Array.isArray(protectRoute)).toBe(true);
      expect(protectRoute).toHaveLength(2);
    });

    it('should call requireAuth from Clerk', () => {
      requireAuth.mockReturnValue(jest.fn());
      const [clerkMiddleware] = protectRoute;
      expect(requireAuth).toHaveBeenCalled();
    });

    it('should authenticate user and call next', async () => {
      const mockUser = {
        _id: '123',
        email: 'user@test.com',
        clerkId: 'clerk123',
      };

      mockReq.auth.mockReturnValue({ userId: 'clerk123' });
      User.findOne.mockResolvedValue(mockUser);

      const [, customMiddleware] = protectRoute;
      await customMiddleware(mockReq, mockRes, mockNext);

      expect(mockReq.auth).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({ clerkId: 'clerk123' });
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 when clerkId is missing', async () => {
      mockReq.auth.mockReturnValue({ userId: null });

      const [, customMiddleware] = protectRoute;
      await customMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized - invalid token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 404 when user not found', async () => {
      mockReq.auth.mockReturnValue({ userId: 'clerk123' });
      User.findOne.mockResolvedValue(null);

      const [, customMiddleware] = protectRoute;
      await customMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 500 when error occurs', async () => {
      mockReq.auth.mockReturnValue({ userId: 'clerk123' });
      User.findOne.mockRejectedValue(new Error('Database error'));

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const [, customMiddleware] = protectRoute;
      await customMiddleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Internal server error' });
      expect(mockNext).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('should log errors to console', async () => {
      mockReq.auth.mockReturnValue({ userId: 'clerk123' });
      const testError = new Error('Test error');
      User.findOne.mockRejectedValue(testError);

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const [, customMiddleware] = protectRoute;
      await customMiddleware(mockReq, mockRes, mockNext);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error in protectRoute middleware', testError);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('adminOnly', () => {
    it('should call next when user is admin', () => {
      mockReq.user = { email: 'admin@test.com' };

      adminOnly(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', () => {
      mockReq.user = null;

      adminOnly(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized - user not found' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user is not admin', () => {
      mockReq.user = { email: 'regular@test.com' };

      adminOnly(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Forbidden - admin access only' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should check exact email match', () => {
      mockReq.user = { email: 'ADMIN@test.com' }; // Different case

      adminOnly(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user object is undefined', () => {
      mockReq.user = undefined;

      adminOnly(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized - user not found' });
    });
  });
});
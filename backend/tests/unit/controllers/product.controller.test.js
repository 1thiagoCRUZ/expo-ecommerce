import { createProduct, getAllProducts, updateProduct } from '../../../src/controllers/product.controller.js';
import { ProductService } from '../../../src/services/product.service.js';
import { ProductRepository } from '../../../src/repositories/product.repository.js';
import { UploadImageService } from '../../../src/services/uploadImage.service.js';

jest.mock('../../../src/services/product.service.js');
jest.mock('../../../src/repositories/product.repository.js');
jest.mock('../../../src/services/uploadImage.service.js');

describe('ProductController', () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    mockReq = {
      body: {},
      files: [],
      params: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create product successfully and return 201', async () => {
      const mockProduct = {
        _id: '123',
        name: 'Test Product',
        price: 99.99,
      };

      mockReq.body = {
        name: 'Test Product',
        description: 'Test Description',
        price: '99.99',
        stock: '10',
        category: 'Electronics',
      };
      mockReq.files = [{ path: '/path/to/image.jpg' }];

      ProductService.prototype.create = jest.fn().mockResolvedValue(mockProduct);

      await createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 400 error when creation fails', async () => {
      mockReq.body = { name: '' };
      mockReq.files = [];

      ProductService.prototype.create = jest.fn().mockRejectedValue(new Error('All fields are required'));

      await createProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should pass body and files to service', async () => {
      const mockCreate = jest.fn().mockResolvedValue({});
      ProductService.prototype.create = mockCreate;

      await createProduct(mockReq, mockRes);

      expect(mockCreate).toHaveBeenCalledWith(mockReq.body, mockReq.files);
    });
  });

  describe('getAllProducts', () => {
    it('should return all products successfully', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1' },
        { _id: '2', name: 'Product 2' },
      ];

      ProductRepository.prototype.findAll = jest.fn().mockResolvedValue(mockProducts);

      await getAllProducts(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockProducts);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return empty array when no products exist', async () => {
      ProductRepository.prototype.findAll = jest.fn().mockResolvedValue([]);

      await getAllProducts(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith([]);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const mockProduct = {
        _id: '123',
        name: 'Updated Product',
      };

      mockReq.params = { id: '123' };
      mockReq.body = { name: 'Updated Product' };
      mockReq.files = [];

      ProductService.prototype.update = jest.fn().mockResolvedValue(mockProduct);

      await updateProduct(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(mockProduct);
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 400 error when update fails', async () => {
      mockReq.params = { id: '123' };
      mockReq.body = {};
      mockReq.files = [];

      ProductService.prototype.update = jest.fn().mockRejectedValue(new Error('Product not found'));

      await updateProduct(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    it('should pass id, body, and files to service', async () => {
      const mockUpdate = jest.fn().mockResolvedValue({});
      ProductService.prototype.update = mockUpdate;

      mockReq.params = { id: '123' };
      mockReq.body = { name: 'Test' };
      mockReq.files = [{ path: '/path/img.jpg' }];

      await updateProduct(mockReq, mockRes);

      expect(mockUpdate).toHaveBeenCalledWith('123', mockReq.body, mockReq.files);
    });
  });
});
import { ProductRepository } from '../../../src/repositories/product.repository.js';
import { Product } from '../../../src/models/product.model.js';

jest.mock('../../../src/models/product.model.js');

describe('ProductRepository', () => {
  let productRepository;

  beforeEach(() => {
    productRepository = new ProductRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        images: ['image1.jpg'],
      };

      const mockProduct = { _id: '123', ...productData };
      Product.create.mockResolvedValue(mockProduct);

      const result = await productRepository.create(productData);

      expect(Product.create).toHaveBeenCalledWith(productData);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products sorted by createdAt descending', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', createdAt: new Date('2024-01-02') },
        { _id: '2', name: 'Product 2', createdAt: new Date('2024-01-01') },
      ];

      const mockSort = jest.fn().mockResolvedValue(mockProducts);
      Product.find.mockReturnValue({ sort: mockSort });

      const result = await productRepository.findAll();

      expect(Product.find).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(result).toEqual(mockProducts);
    });

    it('should return empty array when no products exist', async () => {
      const mockSort = jest.fn().mockResolvedValue([]);
      Product.find.mockReturnValue({ sort: mockSort });

      const result = await productRepository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should find product by id', async () => {
      const productId = '507f1f77bcf86cd799439011';
      const mockProduct = { _id: productId, name: 'Test Product' };

      Product.findById.mockResolvedValue(mockProduct);

      const result = await productRepository.findById(productId);

      expect(Product.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockProduct);
    });

    it('should return null when product not found', async () => {
      Product.findById.mockResolvedValue(null);

      const result = await productRepository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should save updated product', async () => {
      const mockProduct = {
        _id: '123',
        name: 'Updated Product',
        save: jest.fn().mockResolvedValue(this),
      };

      const result = await productRepository.update(mockProduct);

      expect(mockProduct.save).toHaveBeenCalled();
    });
  });

  describe('count', () => {
    it('should return product count', async () => {
      Product.countDocuments.mockResolvedValue(42);

      const result = await productRepository.count();

      expect(Product.countDocuments).toHaveBeenCalled();
      expect(result).toBe(42);
    });

    it('should return zero when no products exist', async () => {
      Product.countDocuments.mockResolvedValue(0);

      const result = await productRepository.count();

      expect(result).toBe(0);
    });
  });
});
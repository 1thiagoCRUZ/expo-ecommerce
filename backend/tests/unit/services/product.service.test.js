import { ProductService } from '../../../src/services/product.service.js';

describe('ProductService', () => {
  let productService;
  let mockProductRepository;
  let mockUploadService;

  beforeEach(() => {
    mockProductRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    };

    mockUploadService = {
      upload: jest.fn(),
    };

    productService = new ProductService(mockProductRepository, mockUploadService);
  });

  describe('create', () => {
    const validData = {
      name: 'Test Product',
      description: 'Test Description',
      price: '99.99',
      stock: '10',
      category: 'Electronics',
    };

    const validFiles = [
      { path: '/path/to/image1.jpg' },
      { path: '/path/to/image2.jpg' },
    ];

    it('should create a product with valid data and files', async () => {
      const mockImages = ['https://cloudinary.com/image1.jpg', 'https://cloudinary.com/image2.jpg'];
      mockUploadService.upload.mockResolvedValue(mockImages);

      const mockProduct = {
        _id: '123',
        name: validData.name,
        description: validData.description,
        price: 99.99,
        stock: 10,
        category: validData.category,
        images: mockImages,
      };
      mockProductRepository.create.mockResolvedValue(mockProduct);

      const result = await productService.create(validData, validFiles);

      expect(mockUploadService.upload).toHaveBeenCalledWith(validFiles);
      expect(mockProductRepository.create).toHaveBeenCalledWith({
        name: validData.name,
        description: validData.description,
        price: 99.99,
        stock: 10,
        category: validData.category,
        images: mockImages,
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw error when name is missing', async () => {
      const invalidData = { ...validData, name: '' };

      await expect(productService.create(invalidData, validFiles)).rejects.toThrow(
        'All fields are required'
      );
      expect(mockUploadService.upload).not.toHaveBeenCalled();
      expect(mockProductRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when description is missing', async () => {
      const invalidData = { ...validData, description: '' };

      await expect(productService.create(invalidData, validFiles)).rejects.toThrow(
        'All fields are required'
      );
    });

    it('should throw error when price is missing', async () => {
      const invalidData = { ...validData, price: '' };

      await expect(productService.create(invalidData, validFiles)).rejects.toThrow(
        'All fields are required'
      );
    });

    it('should throw error when stock is missing', async () => {
      const invalidData = { ...validData, stock: '' };

      await expect(productService.create(invalidData, validFiles)).rejects.toThrow(
        'All fields are required'
      );
    });

    it('should throw error when category is missing', async () => {
      const invalidData = { ...validData, category: '' };

      await expect(productService.create(invalidData, validFiles)).rejects.toThrow(
        'All fields are required'
      );
    });

    it('should throw error when files array is empty', async () => {
      await expect(productService.create(validData, [])).rejects.toThrow(
        'At least one image is required'
      );
    });

    it('should throw error when files is null', async () => {
      await expect(productService.create(validData, null)).rejects.toThrow(
        'At least one image is required'
      );
    });

    it('should throw error when files is undefined', async () => {
      await expect(productService.create(validData, undefined)).rejects.toThrow(
        'At least one image is required'
      );
    });

    it('should throw error when more than 3 files are provided', async () => {
      const tooManyFiles = [
        { path: '/path/to/image1.jpg' },
        { path: '/path/to/image2.jpg' },
        { path: '/path/to/image3.jpg' },
        { path: '/path/to/image4.jpg' },
      ];

      await expect(productService.create(validData, tooManyFiles)).rejects.toThrow(
        'Maximum 3 images allowed'
      );
    });

    it('should accept exactly 3 files', async () => {
      const threeFiles = [
        { path: '/path/to/image1.jpg' },
        { path: '/path/to/image2.jpg' },
        { path: '/path/to/image3.jpg' },
      ];

      const mockImages = ['url1', 'url2', 'url3'];
      mockUploadService.upload.mockResolvedValue(mockImages);
      mockProductRepository.create.mockResolvedValue({});

      await productService.create(validData, threeFiles);

      expect(mockUploadService.upload).toHaveBeenCalledWith(threeFiles);
    });

    it('should convert price to number', async () => {
      mockUploadService.upload.mockResolvedValue(['url1']);
      mockProductRepository.create.mockResolvedValue({});

      await productService.create(validData, validFiles);

      const createCall = mockProductRepository.create.mock.calls[0][0];
      expect(typeof createCall.price).toBe('number');
      expect(createCall.price).toBe(99.99);
    });

    it('should convert stock to number', async () => {
      mockUploadService.upload.mockResolvedValue(['url1']);
      mockProductRepository.create.mockResolvedValue({});

      await productService.create(validData, validFiles);

      const createCall = mockProductRepository.create.mock.calls[0][0];
      expect(typeof createCall.stock).toBe('number');
      expect(createCall.stock).toBe(10);
    });
  });

  describe('update', () => {
    const productId = '507f1f77bcf86cd799439011';
    const updateData = {
      name: 'Updated Product',
      description: 'Updated Description',
      price: '149.99',
      stock: '20',
      category: 'Updated Category',
    };

    it('should update product without new images', async () => {
      const existingProduct = {
        _id: productId,
        name: 'Old Product',
        description: 'Old Description',
        price: 99.99,
        stock: 10,
        category: 'Old Category',
        images: ['old-image.jpg'],
      };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(existingProduct);

      const result = await productService.update(productId, updateData, null);

      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
      expect(existingProduct.name).toBe(updateData.name);
      expect(existingProduct.description).toBe(updateData.description);
      expect(existingProduct.price).toBe(149.99);
      expect(existingProduct.stock).toBe(20);
      expect(existingProduct.category).toBe(updateData.category);
      expect(mockUploadService.upload).not.toHaveBeenCalled();
      expect(mockProductRepository.update).toHaveBeenCalledWith(existingProduct);
    });

    it('should update product with new images', async () => {
      const existingProduct = {
        _id: productId,
        name: 'Old Product',
        price: 99.99,
        stock: 10,
        images: ['old-image.jpg'],
      };

      const newFiles = [{ path: '/path/to/new-image.jpg' }];
      const newImages = ['https://cloudinary.com/new-image.jpg'];

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockUploadService.upload.mockResolvedValue(newImages);
      mockProductRepository.update.mockResolvedValue(existingProduct);

      await productService.update(productId, updateData, newFiles);

      expect(mockUploadService.upload).toHaveBeenCalledWith(newFiles);
      expect(existingProduct.images).toEqual(newImages);
      expect(mockProductRepository.update).toHaveBeenCalledWith(existingProduct);
    });

    it('should throw error when product not found', async () => {
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productService.update(productId, updateData, null)).rejects.toThrow(
        'Product not found'
      );
      expect(mockProductRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error when more than 3 new images provided', async () => {
      const existingProduct = { _id: productId };
      mockProductRepository.findById.mockResolvedValue(existingProduct);

      const tooManyFiles = [
        { path: '/path/1.jpg' },
        { path: '/path/2.jpg' },
        { path: '/path/3.jpg' },
        { path: '/path/4.jpg' },
      ];

      await expect(productService.update(productId, updateData, tooManyFiles)).rejects.toThrow(
        'Maximum 3 images allowed'
      );
    });

    it('should keep existing price when new price not provided', async () => {
      const existingProduct = {
        _id: productId,
        price: 99.99,
        stock: 10,
      };

      const dataWithoutPrice = { ...updateData, price: undefined };
      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(existingProduct);

      await productService.update(productId, dataWithoutPrice, null);

      expect(existingProduct.price).toBe(99.99);
    });

    it('should keep existing stock when new stock not provided', async () => {
      const existingProduct = {
        _id: productId,
        price: 99.99,
        stock: 10,
      };

      const dataWithoutStock = { ...updateData, stock: undefined };
      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(existingProduct);

      await productService.update(productId, dataWithoutStock, null);

      expect(existingProduct.stock).toBe(10);
    });

    it('should handle empty files array as no new images', async () => {
      const existingProduct = {
        _id: productId,
        images: ['old-image.jpg'],
      };

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(existingProduct);

      await productService.update(productId, updateData, []);

      expect(mockUploadService.upload).not.toHaveBeenCalled();
      expect(existingProduct.images).toEqual(['old-image.jpg']);
    });
  });
});
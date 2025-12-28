/**
 * Common test utilities and helpers
 */

/**
 * Creates a mock Express request object
 */
export function createMockRequest(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    auth: jest.fn(),
    files: [],
    ...overrides,
  };
}

/**
 * Creates a mock Express response object
 */
export function createMockResponse() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    render: jest.fn().mockReturnThis(),
  };
  return res;
}

/**
 * Creates a mock next function
 */
export function createMockNext() {
  return jest.fn();
}

/**
 * Waits for async operations to complete
 */
export function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a mock Mongoose document with save method
 */
export function createMockMongooseDoc(data = {}) {
  return {
    ...data,
    save: jest.fn().mockResolvedValue(data),
    toObject: jest.fn().mockReturnValue(data),
    toJSON: jest.fn().mockReturnValue(data),
  };
}

/**
 * Generates a mock MongoDB ObjectId
 */
export function generateMockObjectId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Creates mock file upload data
 */
export function createMockFiles(count = 1) {
  const files = [];
  for (let i = 0; i < count; i++) {
    files.push({
      fieldname: 'images',
      originalname: `test-image-${i + 1}.jpg`,
      encoding: '7bit',
      mimetype: 'image/jpeg',
      path: `/tmp/test-image-${i + 1}.jpg`,
      size: 1024 * 100, // 100KB
    });
  }
  return files;
}

/**
 * Mock product data generator
 */
export function createMockProduct(overrides = {}) {
  return {
    _id: generateMockObjectId(),
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
    category: 'Electronics',
    images: ['https://example.com/image.jpg'],
    averageRating: 0,
    totalReviews: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Mock order data generator
 */
export function createMockOrder(overrides = {}) {
  return {
    _id: generateMockObjectId(),
    user: generateMockObjectId(),
    clerkId: 'clerk_' + generateMockObjectId(),
    orderItems: [
      {
        product: generateMockObjectId(),
        name: 'Test Product',
        price: 99.99,
        quantity: 1,
        image: 'https://example.com/image.jpg',
      },
    ],
    shippingAddress: {
      fullName: 'John Doe',
      streetAddress: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phoneNumber: '555-1234',
    },
    totalPrice: 99.99,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Mock user data generator
 */
export function createMockUser(overrides = {}) {
  return {
    _id: generateMockObjectId(),
    email: 'test@example.com',
    name: 'Test User',
    imageUrl: '',
    clerkId: 'clerk_' + generateMockObjectId(),
    addresses: [],
    wishlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
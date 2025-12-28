/**
 * Integration tests for admin routes
 * These tests verify the complete request flow through middleware and controllers
 */

import request from 'supertest';
import express from 'express';
import adminRoutes from '../../../src/routes/admin.route.js';

// Mock all dependencies
jest.mock('../../../src/middleware/auth.middleware.js', () => ({
  protectRoute: [(req, res, next) => {
    req.user = { email: 'admin@test.com' };
    next();
  }],
  adminOnly: (req, res, next) => next(),
}));

jest.mock('../../../src/middleware/multer.middleware.js', () => ({
  upload: {
    array: () => (req, res, next) => {
      req.files = [];
      next();
    },
  },
}));

jest.mock('../../../src/controllers/product.controller.js', () => ({
  createProduct: jest.fn((req, res) => res.status(201).json({ id: '1', name: 'Test Product' })),
  getAllProducts: jest.fn((req, res) => res.json([{ id: '1', name: 'Product 1' }])),
  updateProduct: jest.fn((req, res) => res.json({ id: '1', name: 'Updated Product' })),
}));

jest.mock('../../../src/controllers/order.controller.js', () => ({
  getAllOrders: jest.fn((req, res) => res.json({ orders: [] })),
  updateOrderStatus: jest.fn((req, res) => res.json({ message: 'Updated' })),
}));

jest.mock('../../../src/controllers/user.controller.js', () => ({
  getAllCustomers: jest.fn((req, res) => res.json([])),
}));

jest.mock('../../../src/controllers/dashboard.controller.js', () => ({
  getDashboardStats: jest.fn((req, res) => res.json({ totalRevenue: 0 })),
}));

describe('Admin Routes Integration', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/admin', adminRoutes);
  });

  describe('Product Routes', () => {
    it('POST /api/admin/products should create a product', async () => {
      const response = await request(app)
        .post('/api/admin/products')
        .send({
          name: 'Test Product',
          description: 'Test Description',
          price: '99.99',
          stock: '10',
          category: 'Electronics',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('GET /api/admin/products should return all products', async () => {
      const response = await request(app).get('/api/admin/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('PUT /api/admin/products/:id should update a product', async () => {
      const response = await request(app)
        .put('/api/admin/products/123')
        .send({ name: 'Updated Product' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'Updated Product');
    });
  });

  describe('Order Routes', () => {
    it('GET /api/admin/orders should return all orders', async () => {
      const response = await request(app).get('/api/admin/orders');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('orders');
    });

    it('PATCH /api/admin/orders/:orderId/status should update order status', async () => {
      const response = await request(app)
        .patch('/api/admin/orders/123/status')
        .send({ status: 'shipped' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Customer Routes', () => {
    it('GET /api/admin/customers should return all customers', async () => {
      const response = await request(app).get('/api/admin/customers');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('Dashboard Routes', () => {
    it('GET /api/admin/stats should return dashboard statistics', async () => {
      const response = await request(app).get('/api/admin/stats');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalRevenue');
    });
  });
});
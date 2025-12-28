// Global test setup
process.env.NODE_ENV = 'test';
process.env.ADMIN_EMAIL = 'admin@test.com';

// Increase timeout for async operations
jest.setTimeout(10000);
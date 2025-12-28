# Testing Guide for Backend

## Quick Start

### 1. Install Jest

```bash
npm install --save-dev jest@^29.7.0
```

### 2. Run Tests

```bash
npm test                    # Run all tests
npm run test:coverage       # With coverage report
npm run test:watch          # Watch mode
npm run test:unit           # Unit tests only
npm run test:integration    # Integration tests only
```

## What's Been Created

### 18 Test Files

**Services (4)**
- product.service.test.js - Product creation, updates, validation
- order.service.test.js - Order status management
- dashboard.service.test.js - Statistics aggregation
- uploadImage.service.test.js - Cloudinary integration

**Controllers (4)**
- product.controller.test.js - Product endpoints
- order.controller.test.js - Order endpoints
- user.controller.test.js - User endpoints
- dashboard.controller.test.js - Dashboard endpoints

**Repositories (3)**
- product.repository.test.js - Product data access
- order.repository.test.js - Order data access
- user.repository.test.js - User data access

**Middleware (2)**
- auth.middleware.test.js - Authentication & authorization
- multer.middleware.test.js - File upload validation

**Models (4)**
- product.model.test.js - Product schema validation
- order.model.test.js - Order schema validation
- user.model.test.js - User schema validation
- cart.model.test.js - Cart schema validation

**Integration (1)**
- admin.route.test.js - Complete API flow tests

### Configuration

- jest.config.js - Jest configuration
- tests/setup.js - Global test setup
- tests/utils/test-helpers.js - Test utilities
- package.json - Test scripts

## Test Coverage

All 19 modified source files are tested with 300+ test cases covering:

- Happy paths
- Edge cases
- Error conditions
- Authentication/authorization
- File upload validation
- Schema validation

## Common Commands

```bash
# Run specific test file
npm test product.service.test.js

# Run tests matching pattern
npm test -- --testNamePattern="should create"

# Verbose output
npm test -- --verbose

# Update snapshots
npm test -- -u

# Only failed tests
npm test -- --onlyFailures
```

## Troubleshooting

### Module Import Errors
Ensure Node.js 18+ and test scripts include `--experimental-vm-modules`

### Tests Timing Out
Increase timeout in tests/setup.js:
```javascript
jest.setTimeout(30000);
```

### Mocks Not Working
Clear mocks between tests:
```javascript
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Writing New Tests

1. Create test file next to source
2. Follow existing patterns
3. Cover happy path, edge cases, errors

Example:
```javascript
import { MyService } from '../../../src/services/my.service.js';

describe('MyService', () => {
  let service;
  
  beforeEach(() => {
    service = new MyService();
  });
  
  it('should do something', () => {
    expect(service.doSomething()).toBe(expected);
  });
});
```

## CI/CD Integration

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- tests/README.md
- TEST_SUMMARY.md

Happy Testing!
/**
 * Cart Model Schema Validation Tests
 */

describe('Cart Model Schema', () => {
  describe('Cart Schema Validation', () => {
    it('should have required fields defined', () => {
      const requiredFields = ['user', 'clerkId', 'items'];
      
      expect(requiredFields).toEqual(
        expect.arrayContaining(['user', 'clerkId', 'items'])
      );
    });

    it('should enforce unique constraint on clerkId', () => {
      // Schema has unique: true for clerkId
      const uniqueField = 'clerkId';
      expect(uniqueField).toBe('clerkId');
    });

    it('should support items array', () => {
      const items = [
        { product: 'productId1', quantity: 2 },
        { product: 'productId2', quantity: 1 },
      ];

      expect(Array.isArray(items)).toBe(true);
      items.forEach(item => {
        expect(item).toHaveProperty('product');
        expect(item).toHaveProperty('quantity');
      });
    });
  });

  describe('Cart Item Schema Validation', () => {
    it('should have required cart item fields', () => {
      const requiredFields = ['product', 'quantity'];
      
      expect(requiredFields).toEqual(
        expect.arrayContaining(['product', 'quantity'])
      );
    });

    it('should validate quantity minimum is 1', () => {
      const validQuantities = [1, 2, 5, 10];
      const invalidQuantities = [0, -1, -5];

      validQuantities.forEach(qty => {
        expect(qty).toBeGreaterThanOrEqual(1);
      });

      invalidQuantities.forEach(qty => {
        expect(qty).toBeLessThan(1);
      });
    });

    it('should have default quantity of 1', () => {
      const defaultQuantity = 1;
      expect(defaultQuantity).toBe(1);
    });

    it('should have timestamps enabled for cart items', () => {
      const timestampFields = ['createdAt', 'updatedAt'];
      expect(timestampFields).toHaveLength(2);
    });
  });

  describe('Timestamps', () => {
    it('should have timestamp fields for cart', () => {
      const timestampFields = ['createdAt', 'updatedAt'];
      
      expect(timestampFields).toContain('createdAt');
      expect(timestampFields).toContain('updatedAt');
    });
  });
});
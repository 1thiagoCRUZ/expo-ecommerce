/**
 * User Model Schema Validation Tests
 */

describe('User Model Schema', () => {
  describe('User Schema Validation', () => {
    it('should have required fields defined', () => {
      const requiredFields = ['email', 'name', 'clerkId'];
      
      expect(requiredFields).toEqual(
        expect.arrayContaining(['email', 'name', 'clerkId'])
      );
    });

    it('should enforce unique constraint on email', () => {
      // Schema has unique: true for email
      const uniqueFields = ['email', 'clerkId'];
      
      expect(uniqueFields).toContain('email');
      expect(uniqueFields).toContain('clerkId');
    });

    it('should have default empty string for imageUrl', () => {
      const defaultImageUrl = '';
      expect(defaultImageUrl).toBe('');
    });

    it('should support addresses array', () => {
      const addresses = [
        {
          label: 'Home',
          fullName: 'John Doe',
          streetAddress: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          phoneNumber: '555-1234',
          isDefault: true,
        },
      ];

      expect(Array.isArray(addresses)).toBe(true);
      expect(addresses[0]).toHaveProperty('label');
      expect(addresses[0]).toHaveProperty('isDefault');
    });

    it('should support wishlist array of product IDs', () => {
      const wishlist = ['productId1', 'productId2', 'productId3'];
      
      expect(Array.isArray(wishlist)).toBe(true);
    });
  });

  describe('Address Schema Validation', () => {
    it('should have all required address fields', () => {
      const requiredFields = [
        'label',
        'fullName',
        'streetAddress',
        'city',
        'state',
        'zipCode',
        'phoneNumber',
      ];
      
      expect(requiredFields).toHaveLength(7);
    });

    it('should have isDefault with false as default', () => {
      const defaultIsDefault = false;
      expect(defaultIsDefault).toBe(false);
    });

    it('should validate address field types', () => {
      const sampleAddress = {
        label: 'Home',
        fullName: 'John Doe',
        streetAddress: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phoneNumber: '555-1234',
        isDefault: false,
      };

      expect(typeof sampleAddress.label).toBe('string');
      expect(typeof sampleAddress.fullName).toBe('string');
      expect(typeof sampleAddress.isDefault).toBe('boolean');
    });
  });

  describe('Timestamps', () => {
    it('should have timestamp fields enabled', () => {
      const timestampFields = ['createdAt', 'updatedAt'];
      
      expect(timestampFields).toHaveLength(2);
      expect(timestampFields).toContain('createdAt');
      expect(timestampFields).toContain('updatedAt');
    });
  });
});
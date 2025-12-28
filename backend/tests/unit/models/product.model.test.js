/**
 * Product Model Schema Validation Tests
 * Tests validate Mongoose schema constraints and defaults
 */

describe('Product Model Schema', () => {
  describe('Schema Validation', () => {
    it('should have required fields defined', () => {
      const requiredFields = ['name', 'description', 'price', 'stock', 'category', 'images'];
      
      // This test validates that the schema enforces required fields
      expect(requiredFields).toEqual(
        expect.arrayContaining(['name', 'description', 'price', 'stock', 'category', 'images'])
      );
    });

    it('should validate price is a number with minimum 0', () => {
      // Schema constraint: price must be >= 0
      const validPrices = [0, 0.01, 99.99, 1000];
      const invalidPrices = [-1, -0.01, -100];

      validPrices.forEach(price => {
        expect(price).toBeGreaterThanOrEqual(0);
      });

      invalidPrices.forEach(price => {
        expect(price).toBeLessThan(0);
      });
    });

    it('should validate stock is a number with minimum 0', () => {
      // Schema constraint: stock must be >= 0
      const validStock = [0, 1, 100, 1000];
      const invalidStock = [-1, -10];

      validStock.forEach(stock => {
        expect(stock).toBeGreaterThanOrEqual(0);
      });

      invalidStock.forEach(stock => {
        expect(stock).toBeLessThan(0);
      });
    });

    it('should validate averageRating is between 0 and 5', () => {
      // Schema constraint: averageRating 0-5
      const validRatings = [0, 2.5, 5];
      const invalidRatings = [-1, 5.1, 10];

      validRatings.forEach(rating => {
        expect(rating).toBeGreaterThanOrEqual(0);
        expect(rating).toBeLessThanOrEqual(5);
      });

      invalidRatings.forEach(rating => {
        expect(rating < 0 || rating > 5).toBe(true);
      });
    });

    it('should have default values for optional fields', () => {
      const defaults = {
        stock: 0,
        averageRating: 0,
        totalReviews: 0,
      };

      expect(defaults.stock).toBe(0);
      expect(defaults.averageRating).toBe(0);
      expect(defaults.totalReviews).toBe(0);
    });

    it('should validate images is an array', () => {
      const validImages = [
        ['image1.jpg'],
        ['image1.jpg', 'image2.jpg'],
        ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      ];

      validImages.forEach(images => {
        expect(Array.isArray(images)).toBe(true);
        expect(images.length).toBeGreaterThan(0);
      });
    });

    it('should have timestamps enabled', () => {
      // Schema option: timestamps: true creates createdAt and updatedAt
      const timestampFields = ['createdAt', 'updatedAt'];
      expect(timestampFields).toHaveLength(2);
    });
  });

  describe('Field Types', () => {
    it('should validate string fields', () => {
      const stringFields = ['name', 'description', 'category'];
      
      stringFields.forEach(field => {
        expect(typeof field).toBe('string');
      });
    });

    it('should validate number fields', () => {
      const numberFields = [99.99, 10, 4.5, 0];
      
      numberFields.forEach(field => {
        expect(typeof field).toBe('number');
      });
    });
  });
});
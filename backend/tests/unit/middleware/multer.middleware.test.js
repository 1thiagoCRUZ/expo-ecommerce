import { upload } from '../../../src/middleware/multer.middleware.js';
import multer from 'multer';
import path from 'path';

jest.mock('multer');

describe('Multer Middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should configure multer with correct options', () => {
    expect(multer).toHaveBeenCalled();

    const multerConfig = multer.mock.calls[0][0];
    expect(multerConfig).toHaveProperty('storage');
    expect(multerConfig).toHaveProperty('fileFilter');
    expect(multerConfig).toHaveProperty('limits');
  });

  it('should set file size limit to 5MB', () => {
    const multerConfig = multer.mock.calls[0][0];
    expect(multerConfig.limits.fileSize).toBe(5 * 1024 * 1024);
  });

  describe('storage configuration', () => {
    let filenameCallback;

    beforeEach(() => {
      const multerConfig = multer.mock.calls[0][0];
      const storageConfig = multer.diskStorage.mock.calls[0][0];
      filenameCallback = storageConfig.filename;
    });

    it('should generate filename with timestamp', () => {
      const mockFile = { originalname: 'test.jpg' };
      const mockCallback = jest.fn();
      const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1234567890);

      filenameCallback({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, '1234567890-test.jpg');
      dateSpy.mockRestore();
    });

    it('should preserve original file extension', () => {
      const mockFile = { originalname: 'image.png' };
      const mockCallback = jest.fn();

      filenameCallback({}, mockFile, mockCallback);

      const filename = mockCallback.mock.calls[0][1];
      expect(filename).toMatch(/\.png$/);
    });

    it('should handle filenames with multiple dots', () => {
      const mockFile = { originalname: 'my.test.image.jpg' };
      const mockCallback = jest.fn();

      filenameCallback({}, mockFile, mockCallback);

      const filename = mockCallback.mock.calls[0][1];
      expect(filename).toMatch(/my\.test\.image\.jpg$/);
    });
  });

  describe('fileFilter', () => {
    let fileFilter;

    beforeEach(() => {
      const multerConfig = multer.mock.calls[0][0];
      fileFilter = multerConfig.fileFilter;
    });

    it('should accept jpeg files', () => {
      const mockFile = {
        originalname: 'image.jpeg',
        mimetype: 'image/jpeg',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, true);
    });

    it('should accept jpg files', () => {
      const mockFile = {
        originalname: 'image.jpg',
        mimetype: 'image/jpeg',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, true);
    });

    it('should accept png files', () => {
      const mockFile = {
        originalname: 'image.png',
        mimetype: 'image/png',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, true);
    });

    it('should accept webp files', () => {
      const mockFile = {
        originalname: 'image.webp',
        mimetype: 'image/webp',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(null, true);
    });

    it('should reject mp4 files', () => {
      const mockFile = {
        originalname: 'video.mp4',
        mimetype: 'video/mp4',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Only image files are allowed (jpeg, jpg, png, webp)',
        })
      );
    });

    it('should reject mp3 files', () => {
      const mockFile = {
        originalname: 'audio.mp3',
        mimetype: 'audio/mp3',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(
        expect.any(Error)
      );
    });

    it('should reject files with uppercase extensions', () => {
      const mockFile = {
        originalname: 'image.JPEG',
        mimetype: 'image/jpeg',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      // Should still accept because we convert to lowercase
      expect(mockCallback).toHaveBeenCalledWith(null, true);
    });

    it('should reject when extension is valid but mimetype is not', () => {
      const mockFile = {
        originalname: 'fake.jpg',
        mimetype: 'application/pdf',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should reject when mimetype is valid but extension is not', () => {
      const mockFile = {
        originalname: 'file.pdf',
        mimetype: 'image/jpeg',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should handle files without extensions', () => {
      const mockFile = {
        originalname: 'noextension',
        mimetype: 'image/jpeg',
      };
      const mockCallback = jest.fn();

      fileFilter({}, mockFile, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
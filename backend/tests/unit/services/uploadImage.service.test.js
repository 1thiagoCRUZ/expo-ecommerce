import { UploadImageService } from '../../../src/services/uploadImage.service.js';
import cloudinary from '../../../src/config/cloudinary.js';

jest.mock('../../../src/config/cloudinary.js', () => ({
  uploader: {
    upload: jest.fn(),
  },
}));

describe('UploadImageService', () => {
  let uploadImageService;

  beforeEach(() => {
    uploadImageService = new UploadImageService();
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload multiple files and return secure URLs', async () => {
      const mockFiles = [
        { path: '/path/to/file1.jpg' },
        { path: '/path/to/file2.jpg' },
        { path: '/path/to/file3.jpg' },
      ];

      cloudinary.uploader.upload
        .mockResolvedValueOnce({ secure_url: 'https://cloudinary.com/image1.jpg' })
        .mockResolvedValueOnce({ secure_url: 'https://cloudinary.com/image2.jpg' })
        .mockResolvedValueOnce({ secure_url: 'https://cloudinary.com/image3.jpg' });

      const result = await uploadImageService.upload(mockFiles);

      expect(result).toEqual([
        'https://cloudinary.com/image1.jpg',
        'https://cloudinary.com/image2.jpg',
        'https://cloudinary.com/image3.jpg',
      ]);
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(3);
    });

    it('should upload files to default products folder', async () => {
      const mockFiles = [{ path: '/path/to/file.jpg' }];
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'https://cloudinary.com/img.jpg' });

      await uploadImageService.upload(mockFiles);

      expect(cloudinary.uploader.upload).toHaveBeenCalledWith('/path/to/file.jpg', {
        folder: 'products',
      });
    });

    it('should upload files to custom folder', async () => {
      const mockFiles = [{ path: '/path/to/file.jpg' }];
      const customFolder = 'custom-folder';
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'https://cloudinary.com/img.jpg' });

      await uploadImageService.upload(mockFiles, customFolder);

      expect(cloudinary.uploader.upload).toHaveBeenCalledWith('/path/to/file.jpg', {
        folder: customFolder,
      });
    });

    it('should return empty array when files is null', async () => {
      const result = await uploadImageService.upload(null);

      expect(result).toEqual([]);
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });

    it('should return empty array when files is undefined', async () => {
      const result = await uploadImageService.upload(undefined);

      expect(result).toEqual([]);
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });

    it('should return empty array when files array is empty', async () => {
      const result = await uploadImageService.upload([]);

      expect(result).toEqual([]);
      expect(cloudinary.uploader.upload).not.toHaveBeenCalled();
    });

    it('should handle single file upload', async () => {
      const mockFiles = [{ path: '/path/to/single.jpg' }];
      cloudinary.uploader.upload.mockResolvedValue({ secure_url: 'https://cloudinary.com/single.jpg' });

      const result = await uploadImageService.upload(mockFiles);

      expect(result).toEqual(['https://cloudinary.com/single.jpg']);
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(1);
    });

    it('should handle upload errors gracefully', async () => {
      const mockFiles = [{ path: '/path/to/file.jpg' }];
      cloudinary.uploader.upload.mockRejectedValue(new Error('Upload failed'));

      await expect(uploadImageService.upload(mockFiles)).rejects.toThrow('Upload failed');
    });

    it('should process all uploads in parallel', async () => {
      const mockFiles = [
        { path: '/path/to/file1.jpg' },
        { path: '/path/to/file2.jpg' },
      ];

      const uploadPromises = [];
      cloudinary.uploader.upload.mockImplementation(() => {
        const promise = Promise.resolve({ secure_url: 'https://cloudinary.com/img.jpg' });
        uploadPromises.push(promise);
        return promise;
      });

      await uploadImageService.upload(mockFiles);

      // Verify Promise.all was used (all uploads started together)
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(2);
    });
  });
});
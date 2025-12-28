import cloudinary from "../config/cloudinary.js";

export class UploadImageService {
  async upload(files, folder = "products") {
    if (!files || files.length === 0) return [];

    const uploads = files.map(file =>
      cloudinary.uploader.upload(file.path, { folder })
    );

    const results = await Promise.all(uploads);
    return results.map(r => r.secure_url);
  }
}

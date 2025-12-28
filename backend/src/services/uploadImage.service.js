import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

export class UploadImageService {
  async upload(files, folder = "products") {
    if (!files || files.length === 0) return [];
    try {
      const uploads = files.map(file =>
        cloudinary.uploader.upload(file.path, { folder })
      );
      const results = await Promise.all(uploads);

      await Promise.all(files.map(file =>
        fs.unlink(file.path).catch(err =>
          console.error(`Failed to delete ${file.path}:`, err)
        )
      ));

      return results.map(r => r.secure_url);
    } catch (error) {
      // Clean up local files even on failure
      await Promise.all(files.map(file =>
        fs.unlink(file.path).catch(() => { })
      ));
      throw new Error(`Image upload failed: ${error.message}`);
    }
  }
}

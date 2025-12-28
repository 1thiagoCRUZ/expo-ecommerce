import { ProductRepository } from "../repositories/product.repository.js";
import { UploadImageService } from "../services/uploadImage.service.js";
import { ProductService } from "../services/product.service.js";

const productService = new ProductService(
  new ProductRepository(),
  new UploadImageService()
);

export async function createProduct(req, res) {
  try {
    const product = await productService.create(req.body, req.files);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getAllProducts(_, res) {
  const products = await productService.productRepository.findAll();
  res.json(products);
}

export async function updateProduct(req, res) {
  try {
    const product = await productService.update(
      req.params.id,
      req.body,
      req.files
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

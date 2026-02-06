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
  try {
    const products = await productService.getAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await productService.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    if (err.message === "Product not found") {
      return res.status(404).json({ message: err.message });
    }
    console.error("Error in getProductById:", err);
    res.status(500).json({ message: "Internal server error" });
  }
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
    const status = err.message === "Product not found" ? 404 : 400;
    res.status(status).json({ message: err.message });
  }
}
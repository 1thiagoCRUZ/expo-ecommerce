import { Product } from "../models/product.model.js";

export class ProductRepository {
  create(data) {
    return Product.create(data);
  }

  findAll() {
    return Product.find().sort({ createdAt: -1 });
  }

  findById(id) {
    return Product.findById(id);
  }

  update(product) {
    return product.save();
  }

  async decreaseStock(productId, quantity) {
    return Product.findByIdAndUpdate(productId, {
      $inc: { stock: -quantity }
    });
  }
  
  async increaseStock(productId, quantity) {
    return Product.findByIdAndUpdate(productId, {
      $inc: { stock: quantity }
    });
  }

  count() {
    return Product.countDocuments();
  }
}

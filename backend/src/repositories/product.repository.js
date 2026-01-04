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
    return Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { new: true, runValidators: true }
    ).then(product => {
      if (!product) {
        throw new Error("Product not found");
      }
      if (product.stock < 0) {
        // Rollback by incrementing back
        return Product.findByIdAndUpdate(
          productId,
          { $inc: { stock: quantity } },
          { new: true }
        ).then(() => {
          throw new Error("Insufficient stock");
        });
      }
      return product;
    });
  }

  async increaseStock(productId, quantity) {
    if (quantity <= 0) {
      throw new Error("Quantity must be positive");
    }
    const product = await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    );
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  count() {
    return Product.countDocuments();
  }
}

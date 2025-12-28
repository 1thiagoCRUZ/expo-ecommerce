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

  count() {
    return Product.countDocuments();
  }
}

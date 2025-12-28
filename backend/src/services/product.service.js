export class ProductService {
  constructor(productRepository, uploadService) {
    this.productRepository = productRepository;
    this.uploadService = uploadService;
  }

  async create(data, files) {
    const { name, description, price, stock, category } = data;

    if (!name || !description || !price || !stock || !category) {
      throw new Error("All fields are required");
    }

    if (!files || files.length === 0) {
      throw new Error("At least one image is required");
    }

    if (files.length > 3) {
      throw new Error("Maximum 3 images allowed");
    }

    const images = await this.uploadService.upload(files);

    return this.productRepository.create({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      category,
      images,
    });
  }

  async update(id, data, files) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error("Product not found");

    Object.assign(product, {
      ...data,
      price: data.price ? Number(data.price) : product.price,
      stock: data.stock ? Number(data.stock) : product.stock,
    });

    if (files && files.length > 0) {
      if (files.length > 3) {
        throw new Error("Maximum 3 images allowed");
      }

      product.images = await this.uploadService.upload(files);
    }

    return this.productRepository.update(product);
  }
}

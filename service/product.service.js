const {
  Product,
  ClothingProduct,
  ElectronicsProduct,
} = require("../models/product.model");

class ProductService {
  async getAllProducts() {
    const products = await Product.find();
    return products;
  }

  async createProduct(data) {
    let newProduct;
    switch (data.category) {
      case "clothing":
        newProduct = await ClothingProduct.create(data);
        break;
      case "electronics":
        newProduct = await ElectronicsProduct.create(data)
        break;
      default:
        newProduct = await Product.create(data);
    }
    return newProduct;
  }

  async productById(id) {
    const product = await Product.findById(id);
    return product;
  }

  async update(data, id) {
    if (!id) {
      throw new Error("Id not found");
    }

    const isProduct = await this.productById(id);

    if (!isProduct) {
      throw new Error("Product not found");
    }

    const updateProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateProduct;
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }
}

module.exports = new ProductService();

const {
  Product,
  ClothingProduct,
  ElectronicsProduct,
} = require("../models/product.model");
const fileService = require("./file.service");
const BaseError = require("../errors/base.error");

class ProductService {
  async getAllProducts() {
    const products = await Product.find();
    return products;
  }

  async createProduct(data, pictures) {
    let newProduct;
    console.log(pictures)
    const allPictures = pictures.map((picture) => {
      return {image: fileService.save(picture.image), ...picture}
    });
    const allData = { ...data, images: allPictures };
    switch (data.category) {
      case "clothing":
        newProduct = await ClothingProduct.create(allData);
        break;
      case "electronics":
        newProduct = await ElectronicsProduct.create(allData);
        break;
      default:
        newProduct = await Product.create(allData);
    }
    return newProduct;
  }

  async productById(id) {
    const product = await Product.findById(id);
    return product;
  }

  async update(data, id) {
    if (!id) {
      throw  BaseError.BadRequest("Id not found");
    }

    const isProduct = await this.productById(id);

    if (!isProduct) {
      throw BaseError.BadRequest("Product not found");
    }

    const updateProduct = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });
    return updateProduct;
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async addRating(productId, userId, rating) {
    if (!userId) {
      throw BaseError.UnAuthorizedError();
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw BaseError.BadRequest("Product not found");
    }

    // exist user
    const existingRating = product.ratings.find(
      (r) => r.userId.toString() === userId
    );
    if (existingRating) {
      throw BaseError.BadRequest("You have already rated this product");
    }
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId },
      {
        $push: {
          ratings: { userId, rating },
        },
      },
      { new: true }
    );

    if (!updatedProduct) {
      throw BaseError.BadRequest("Product not found");
    }

    // calculate average rating
    const totalRating = updatedProduct.ratings.length;
    const sumRating = updatedProduct.ratings.reduce(
      (sum, r) => sum + r.rating,
      0
    );
    const averageRating = sumRating / totalRating;
    // Faqat averageRating ni yangilash
    await Product.updateOne({ _id: productId }, { $set: { averageRating } });
    return true;
  }
}

module.exports = new ProductService();

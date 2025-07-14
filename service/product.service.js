const {
  Product,
  ClothingProduct,
  ElectronicsProduct,
} = require("../models/product.model");
const BaseError = require("../errors/base.error");

class ProductService {
  async getAllProducts(queryParamter) {
    // pagination parametr
    const page = parseInt(queryParamter.page);
    const limit = parseInt(queryParamter.limit);
    const skip = (page - 1) * limit;

    // sort and filter
    const sort = queryParamter.sort || "-createdAt";
    const category = queryParamter.category;
    const second_category = queryParamter.second_category;
    const search = queryParamter.search;
    let query = {};
    if (category) {
      query.category = category;
    }

    if(second_category) {
      query.second_category = second_category
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    } // Ma'lumotlarni olish
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Umumiy mahsulotlar soni
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return{
      success: true,
      data: products,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    }
  }

  async createProduct(data) {
    let newProduct;
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
      throw BaseError.BadRequest("Id not found");
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

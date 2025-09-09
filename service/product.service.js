const {
  Product,
  ClothingProduct,
  ElectronicsProduct,
  HomeProduct,
  BeautyProduct,
  OtherProduct,
} = require("../models/Product/index");
const BaseError = require("../errors/base.error");
const { generateUniqueSlug } = require("../utils/slugify");
class ProductService {
  async getAllProducts(queryParamter) {
    // pagination parametr
    const page = parseInt(queryParamter.page);
    const limit = parseInt(queryParamter.limit);
    const skip = (page - 1) * limit;

    // filter
    const {
      category,
      second_category,
      minPrice,
      maxPrice,
      minRating,
      search,
      sortBy,
    } = queryParamter;
    let query = {};
    if (category) {
      query.category = category;
    }

    if (second_category) {
      query.second_category = second_category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // Sortlash parametrlari
    let sortOption = { createdAt: -1 }; // Default: yangilari birinchi

    if (sortBy) {
      switch (sortBy) {
        case "rating":
          sortOption = { averageRating: -1 };
          break;
        case "price_asc":
          sortOption = { price: 1 };
          break;
        case "price_desc":
          sortOption = { price: -1 };
          break;
        case "popular":
          sortOption = { sold_count: -1 };
          break;
        case "newest":
          sortOption = { createdAt: -1 };
          break;
      }
    }

    // Ma'lumotlarni olish
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean()
      .populate("author");

    // Umumiy sonni hisoblash
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Javobni tayyorlash
    const response = {
      success: true,
      count: products.length,
      data: products,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        applied: {
          category,
          minRating,
          priceRange: { minPrice, maxPrice },
          sortBy,
          search,
        },
        available: {
          categories: await Product.distinct("category"),
          maxPrice: await Product.findOne()
            .sort({ price: -1 })
            .select("price -_id"),
          minPrice: await Product.findOne()
            .sort({ price: 1 })
            .select("price -_id"),
          maxRating: 5,
        },
      },
    };
    return response;
  }

  async createProduct(data) {
    const slug = await generateUniqueSlug(Product, data.name.en);

    const productData = { ...data, slug };
    let newProduct;

    switch (productData.categories.main.en) {
      case "clothing":
        newProduct = await ClothingProduct.create(productData);
        break;
      case "electronics":
        newProduct = await ElectronicsProduct.create(productData);
        break;
      case "home":
        newProduct = await HomeProduct.create(productData);
        break;
      case "beauty":
        newProduct = await BeautyProduct.create(productData);
        break;
      case "other":
        newProduct = await OtherProduct.create(productData);
        break;
      default:
        newProduct = await Product.create(productData);
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

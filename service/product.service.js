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
  async getAllProducts(queryParameters) {
    const {
      page = 1,
      total = 10,
      search,
      brand,
      category,
      subCategory,
      status,
      featured,
      minPrice,
      maxPrice,
      inStock,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = queryParameters;

    // Filter obyektini yaratish
    const filter = {};

    // Search (nomi bo'yicha)
    if (search) {
      filter.$or = [
        { "name.uz": { $regex: search, $options: "i" } },
        { "name.ru": { $regex: search, $options: "i" } },
        { "name.en": { $regex: search, $options: "i" } },
        { "description.uz": { $regex: search, $options: "i" } },
        { "description.ru": { $regex: search, $options: "i" } },
        { "description.en": { $regex: search, $options: "i" } },
      ];
    }

    // Brand bo'yicha filter
    if (brand) {
      filter.$or = [
        { "brand.uz": { $regex: brand, $options: "i" } },
        { "brand.ru": { $regex: brand, $options: "i" } },
        { "brand.en": { $regex: brand, $options: "i" } },
      ];
    }

    // Category bo'yicha filter
    if (category) {
      filter.$or = [
        { "categories.main.uz": category },
        { "categories.main.ru": category },
        { "categories.main.en": category },
      ];
    }

    // Sub-category bo'yicha filter
    if (subCategory) {
      filter.$or = [
        { "categories.sub.uz": subCategory },
        { "categories.sub.ru": subCategory },
        { "categories.sub.en": subCategory },
      ];
    }

    // Status bo'yicha filter
    if (status) {
      filter.$or = [
        { "status.uz": status },
        { "status.ru": status },
        { "status.en": status },
      ];
    }

    // Featured bo'yicha filter
    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    // Narx bo'yicha filter
    if (minPrice || maxPrice) {
      filter["price.basePrice"] = {};
      if (minPrice) filter["price.basePrice"].$gte = Number(minPrice);
      if (maxPrice) filter["price.basePrice"].$lte = Number(maxPrice);
    }

    // Stock bo'yicha filter
    if (inStock !== undefined) {
      if (inStock === "true") {
        filter.$or = [
          { "inventory.totalQuantity": { $gt: 0 } },
          { "inventory.variants.sizes.quantity": { $gt: 0 } },
        ];
      } else {
        filter.$and = [
          { "inventory.totalQuantity": 0 },
          { "inventory.variants.sizes.quantity": 0 },
        ];
      }
    }

    // Sortlash
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Paginatsiya
    const skip = (page - 1) * total;
    const limit = parseInt(total);

    try {
      // Productlarni olish
      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .populate("vendor", "name email") // Vendor ma'lumotlarini populate qilish
        .exec();

      // Umumiy productlar soni
      const totalProducts = await Product.countDocuments(filter);

      // Umumiy sahifalar soni
      const totalPages = Math.ceil(totalProducts / limit);

      // Paginatsiya ma'lumotlari
      const pagination = {
        currentPage: page,
        totalPages,
        totalProducts,
        hasNext: page < totalPages,
        hasPrev: page > 1,
        limit,
      };

      return {
        success: true,
        data: products,
        pagination,
      };
    } catch (error) {
      throw new Error(`Productlarni olishda xatolik: ${error.message}`);
    }
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

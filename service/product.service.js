const mongoose = require("mongoose");
const BaseError = require("../errors/base.error");
const { generateUniqueSlug } = require("../utils/slugify");

// product models
const Product = mongoose.model("Product");
const ClothingProduct = mongoose.model("ClothingProduct");
const ElectronicsProduct = mongoose.model("ElectronicsProduct");
const HomeProduct = mongoose.model("HomeProduct");
const BeautyProduct = mongoose.model("BeautyProduct");
const OtherProduct = mongoose.model("OtherProduct");

class ProductService {
  async getAllProducts(queryParameters, language = "uz") {
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
      // Umumiy productlar sonitotalPages
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
        data: products.map((product) => product.toJSON({ language })),
        pagination,
      };
    } catch (error) {
      console.log(error);
      // throw new Error(`Productlarni olishda xatolik: ${error.message}`);
    }
  }
  async getProductsByShop(shopId, options, lang) {
    const { page = 1, limit = 10, brand, status, minPrice, maxPrice } = options;

    // filter variables
    const filter = { vendor: shopId };

    // status filter
    if (status) filter.status = status;

    // brand filter
    if (brand) filter.brand = { $regex: new RegExp(brand, "i") };

    // price filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter["price.amount"] = {};

      if (minPrice !== undefined && !isNaN(parseFloat(minPrice))) {
        filter["price.amount"].$gte = parseFloat(minPrice);
      }

      if (maxPrice !== undefined && !isNaN(parseFloat(maxPrice))) {
        filter["price.amount"].$lte = parseFloat(maxPrice);
      }
    }

    // sort
    // const sort = ;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const count = await Product.countDocuments(filter);
    const limitNum = parseInt(limit);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("vendor", "email name");

    const totalPages = Math.ceil(count / limitNum);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    return {
      success: true,
      data: products.map((product) => product.toJSON({ lang })),
      pagination: {
        page: parseInt(page),
        limit: limitNum,
        total: count,
        skip: skip,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
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

    if (!product) throw BaseError.NotFound();
    return product;
  }

  async update(data, id) {
    if (!id) {
      throw BaseError.BadRequest("Id not found");
    }

    await this.productById(id);

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
      (r) => r.userId.toString() === userId,
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
      { new: true },
    );

    if (!updatedProduct) {
      throw BaseError.BadRequest("Product not found");
    }

    // calculate average rating
    const totalRating = updatedProduct.ratings.length;
    const sumRating = updatedProduct.ratings.reduce(
      (sum, r) => sum + r.rating,
      0,
    );
    const averageRating = sumRating / totalRating;
    // Faqat averageRating ni yangilash
    await Product.updateOne({ _id: productId }, { $set: { averageRating } });
    return true;
  }

  async addDiscountProduct(productId, shopId, discountData, lang) {
    const { type, value, startDate, endDate } = discountData;

    if ((type === "percentage" && value < 0) || value > 100) {
      return {
        success: false,
        message: "Percentage discount must be between 0 and 100",
      };
    }
    if (type === "amount" && value < 0) {
      return {
        success: false,
        message: "Amount discount  must be greater than 0",
      };
    }

    const discount = {
      type,
      value,
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: true,
    };

    const product = await Product.findOneAndUpdate(
      { _id: productId, vendor: shopId },
      { $set: { "price.discount": discount } },
      { new: true },
    );

    if (!product) {
      throw BaseError.NotFound("Product", lang);
    }

    const successMessages = {
      uz: "Chegirmalar muvaffaqiyatli qo'shildi",
      ru: "Скидки успешно добавлены.",
      en: "Discounts added successfully",
    };
    return {
      success: true,
      message: successMessages[lang],
      data: product,
    };
  }

  async addDiscountToMultipleProducts(productIds, shopId, discountData, lang) {
    const { type, value, startDate, endDate } = discountData;

    if ((type === "percentage" && value < 0) || value > 100) {
      return {
        success: false,
        message: "Percentage discount must be between 0 and 100",
      };
    }
    if (type === "amount" && value < 0) {
      return {
        success: false,
        message: "Amount discount  must be greater than 0",
      };
    }

    const discount = {
      type: type,
      value: value,
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: true,
    };

    const results = await Product.updateMany(
      {
        _id: { $in: productIds },
        vendor: shopId,
      },
      {
        $set: { "price.amount": discount },
      },
    );
    const successMessages = {
      uz: "Chegirmalar muvaffaqiyatli qo'shildi",
      ru: "Скидки успешно добавлены.",
      en: "Discounts added successfully",
    };
    return {
      success: true,
      message: successMessages[lang],
      data: results,
    };
  }

  async removeDiscountProduct(productId, shopId, lang) {
    const product = await Product.findOneAndUpdate(
      { _id: productId, vendor: shopId },
      {
        $set: {
          "price.discount.type": null,
          "price.discount.value": 0,
          "price.discount.startDate": null,
          "price.discount.endDate": null,
          "price.discount.isActive": false,
        },
      },
    );

    if (!product) {
      throw BaseError.NotFound(null, lang);
    }
    const resultMessages = {
      uz: "Chegirma muvaffaqiyatli olib tashlandi",
      ru: "Скидка успешно удалена",
      en: "Discount successfully removed",
    };
    return {
      success: true,
      message: resultMessages[lang],
      data: product,
    };
  }

  async extendDiscountExpiry(productId, shopId, newEndDate, lang) {
    const product = await Product.findOneAndUpdate(
      { _id: productId, vendor: shopId },
      { $set: { "price.discount.endDate": newEndDate } },
      { new: true },
    );

    if (!product) {
      throw BaseError.NotFound(null, lang);
    }

    const resultMessages = {
      uz: "Chegirmaning amal qilish muddati muvaffaqiyatli o'zgartirildi.",
      ru: "Срок действия скидки успешно изменен.",
      en: "The discount expiration date has been successfully changed.",
    };

    return {
      success: true,
      message: resultMessages[lang],
      data: product,
    };
  }
}

module.exports = new ProductService();

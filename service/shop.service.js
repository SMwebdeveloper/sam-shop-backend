const mongoose = require("mongoose");
const { generateUniqueSlug } = require("../utils/slugify");
const BaseError = require("../errors/base.error");

// model
const Shop = mongoose.model("Shop");

// service class
class ShopService {
  async create(data, ownerId, lang) {
    const existingShop = await Shop.findOne({
      owner: ownerId,
      "name.en": data.name.en,
    });

    if (existingShop) {
      const messages = {
        uz: "Shu nom bilan do'kon mavjud iltimos boshqa nom tanglang",
        ru: "Магазин с таким названием уже существует, пожалуйста, выберите другое название.",
        en: "A store with this name already exists, please choose a different name.",
      };
      throw BaseError.Conflict(messages, lang);
    }
    const slug = await generateUniqueSlug(Shop, data.name.en);
    const newShop = new Shop({
      ...data,
      slug,
      owner: ownerId,
      status: "pending",
      isVerified: false,
      isFeatured: true,
    });

    const savedShop = newShop.save();
    
    const messages = {
      uz: "Doʻkon muvaffaqiyatli yaratildi",
      en: "Store successfully created",
      ru: "Магазин успешно создан",
    };
    return {
      success: true,
      message: messages[lang],
      data: savedShop,
    };
  }
  async getShopByVendor(vendorId) {
    if (!vendorId) return;
  }
}

module.exports = new ShopService();

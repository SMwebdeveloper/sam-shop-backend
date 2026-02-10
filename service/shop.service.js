const mongoose = require("mongoose");
const { generateUniqueSlug } = require("../utils/slugify");
const BaseError = require("../errors/base.error");

// model
const Shop = mongoose.model("Shop");

// service class
class ShopService {
  async create(data) {
    const slug = await generateUniqueSlug(Shop, data.name.en);
    const newShop = { ...data, slug };
    const newData = await Shop.create(newShop);

    return {
      success: true,
      data: newData,
    };
  }
  async getShopByVendor(vendorId) {
    if (!vendorId) return;
  }
}

module.exports = new ShopService();

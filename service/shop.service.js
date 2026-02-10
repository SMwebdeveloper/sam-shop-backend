const mongoose = require("mongoose")
const { generateUniqueSlug } = require("../utils/slugify");

// model
const Shop = mongoose.model("Shop")

// service class
class ShopService {
  async create(data) {
    const slug = generateUniqueSlug(Shop, data.name.en)
  }
}

const shopService = require("../service/shop.service");
class ShopController {
  async createShop(req, res, next) {
    try {
      const data = req.body;
      console.log(data);
      const response = await shopService.create(data);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  async getShopByVendor(req, res, next) {}
  async getShopById(req, res, next) {}
  async updateShop(req, res, next) {}
}

module.exports = new ShopController();

const shopService = require("../service/shop.service");
class ShopController {
  async getAllShops(req, res, next) {
    try {
      const response = await shopService.getAllShops(req.query, req.lang);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async createShop(req, res, next) {
    try {
      const data = req.body;
      const ownerId = req.user.id;
      const lang = req.lang;
      console.log(data);
      const response = await shopService.create(data, ownerId, lang);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  async getShopByOnwer(req, res, next) {
    try {
      const ownerId = req.user.id;
      const response = await shopService.getMyShops(
        req.query,
        req.lang,
        ownerId,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getShopBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const response = await shopService.getShopBySlug(slug, req.lang);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async updateShop(req, res, next) {
    try {
      const { id } = req.params;
      const response = await shopService.updateShop(
        id,
        req.body,
        req.lang,
        req.user,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async deleteShop (req, res, next) {
    try{
      const {id} = req.params
      const response = await shopService.deleteShop(id, req.user.id, req.lang)
      return res.status(200).json(response)
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}

module.exports = new ShopController();

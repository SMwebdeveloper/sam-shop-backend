const categoryService = require("../service/category.service");
class CategoriesController {
  async getAllCategories(req, res, next) {
    try {
      const lang = req.headers["accept-language"] || "uz";
      const categories = await categoryService.getAllCategories(lang);
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoriesController();

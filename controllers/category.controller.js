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

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const lang = req.headers["accept-language"] || "uz";
      const response = await categoryService.getCategoryById(id, lang);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const data = req.body;
      const lang = req.headers["accept-languge"] || "uz";
      const response = await categoryService.createCategory(data, lang);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  async updateCategory(req, res, next) {
    try {
      const lang = req.headers["accept-language"] || "uz";
      const { id } = req.params;
      const data = req.body;

      const response = await categoryService.updateCategory(data, id, lang);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoriesController();

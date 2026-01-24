const categoryService = require("../service/category.service");
class CategoriesController {
  async getAllCategories(req, res, next) {
    try {

      const categories = await categoryService.getAllCategories(req.lang);
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;

      const response = await categoryService.getCategoryById(id, req.lang);

      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const data = req.body;
      const response = await categoryService.createCategory(data, req.lang);
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
  async updateCategory(req, res, next) {
    try {
      const { id } = req.params;
      const data = req.body;
      const response = await categoryService.updateCategory(data, id, req.lang);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      const response = await categoryService.deleteCategory(id, req.lang);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async archivedCategory(req, res, next) {
    try {
      const {id} = req.params
      const response = await categoryService.archivedCategory(id, req.lang)
      return res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  async createSubCategory(req, res, next) {
    try{
    
    } catch(error) {
      next(error)
    }
  }
}

module.exports = new CategoriesController();

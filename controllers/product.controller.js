const productService = require("../service/product.service");

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const products = await productService.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const productData = req.body;
      const newProduct = await productService.createProduct(productData);
      return res.status(201).json(newProduct);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.productById(id);
      res.status(200).json(product)
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();

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
      const pictures = req.files;
      console.log(pictures)
      // const newProduct = await productService.createProduct(
      //   productData,
      //   pictures
      // );
    // return res.status(201).json(newProduct);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.productById(id);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const product = req.body;
      const updateProduct = await productService.update(product, id);
      return res.status(200).json(updateProduct);
    } catch (error) {
      next(error);
    }
  }
  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await productService.delete(id);
      return res.status(500).json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async addProductRating(req, res, next) {
    try {
      const {userId, rating } = req.body;
      const {id} = req.params
      await productService.addRating(id, userId, rating);
      res.status(201).json({success: true});
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();

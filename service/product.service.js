const productModel = require("../models/product.model")

class ProductService {
 async getAllProducts (){
   const products = await productModel.find()
   return products
 }

 async createProduct (data) {
   const newProduct = await productModel.create(data)
   return newProduct
 }

 async productById (id) {
    const product = await productModel.findById(id)
    return product
 }
}

module.exports = new ProductService()
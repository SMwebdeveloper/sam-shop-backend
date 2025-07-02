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

 async update(data, id) {
    if(!id) {
        throw new Error("Id not found")
    }

    const isProduct = await this.productById(id)

    if(!isProduct) {
        throw new Error("Product not found")
    }

    const updateProduct = await productModel.findByIdAndUpdate(id, data, {new: true})
    return updateProduct
 }

 async delete (id) {
    return await productModel.findByIdAndDelete(id)
 }
}

module.exports = new ProductService()
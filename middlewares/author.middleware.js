const BaseError = require("../errors/base.error");
const mongoose = require("mongoose")

const Product = mongoose.model("Product")
const Shop = mongoose.model("Shop")

module.exports = async function (req, res, next) {
  try {
    const product = await Product.findById(req.params.id)
    const author = req.user.id

    if(product.author.toString() !== author) {
        return next(BaseError.BadRequest("Only author can edit and delete this product"))
    }
    next()
  } catch (error) {
    return next(BaseError.BadRequest("Only author can edit this post"));
  }
};

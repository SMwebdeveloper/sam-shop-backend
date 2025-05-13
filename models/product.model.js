const {Schema, model} = require("mongoose")

const ProductSchema = new Schema({
    product_name: {type: String, required: true},
    description: {type: String, required: true},
    product_count: {type: Number, required: true},
    product_price: {type: String, required: true},
})

module.exports = model("Product", ProductSchema)
const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    count: { type: Number, required: true },
    price: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["clothing", "electronics", "other"],
    },
    second_category: { type: String, required: true },
    brand: { type: String },
    images: [String],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, discriminatorKey: "productType" }
);

const clothingProductSchema = new Schema({
  size: [
    {
      sizeValue: String,
      quality: Number,
    },
  ],
  colors: [{ colorName: String, quality: Number }],
  material: { type: String },
});

const electronicsProductSchema = new Schema({
  storage: [String],
  ram: [String],
  processor: { type: String },
  screenSize: [String],
  batteryCapacity: { type: String },
  colors: [String],
});
const Product = model("Product", ProductSchema);

const ClothingProduct = Product.discriminator(
  "ClothingProduct",
  clothingProductSchema
);
const ElectronicsProduct = Product.discriminator(
  "ElectronicsProduct",
  electronicsProductSchema
);

module.exports = { Product, ClothingProduct, ElectronicsProduct };

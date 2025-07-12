const { Schema, model } = require("mongoose");

// product schema
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
    sold_count: { type: Number },
    isActive: { type: Boolean, required: true },
    second_category: { type: String, required: true },
    brand: { type: String },
    images: [
      // {
      //   image: { type: String, required: true },
      //   first: { type: Boolean, default: false },
      // },
      String
    ],
    ratings: [
      {
        userId: { type: Schema.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    averageRating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true, discriminatorKey: "productType" }
);

//  clothing product schema
const clothingProductSchema = new Schema({
  size: [
    {
      sizeValue: { type: String },
      quality: { type: Number },
      _id: false,
    },
  ],
  colors: [
    { colorName: { type: String }, quality: { type: Number }, _id: false },
  ],
  material: { type: String },
});

// electronicsProductSchema
const electronicsProductSchema = new Schema({
  storage: [String],
  ram: [String],
  processor: { type: String },
  screenSize: [String],
  batteryCapacity: { type: String },
  colors: [
    { colorName: { type: String }, quality: { type: Number }, _id: false },
  ],
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

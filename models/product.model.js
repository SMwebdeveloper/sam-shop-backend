const { Schema, model } = require("mongoose");

const PriceSchema = new Schmema({
  basePrice: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: "UZS",
    enum: ["UZS", "USD", "EUR"],
  },
  discount: {
    amount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0, min: 0, max: 100 },
    startDate: Date,
    endDate: Date,
  },
  taxRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
});
// product schema
const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    count: { type: Number, required: true },
    price: PriceSchema,
    priceHistory: [PriceSchema],
    category: {
      type: String,
      required: true,
      enum: ["clothing", "electronics", "other"],
    },
    sold: {
      sold_count: { type: Number },
      sold_history: [
        {
          userId: { type: Schema.ObjectId, ref: "User" },
          price: PriceSchema,
          count: { type: Number },
        },
      ],
    },
    isActive: { type: Boolean, required: true, default: false },
    second_category: { type: String, required: true },
    brand: { type: String },
    author: { type: Schema.ObjectId, ref: "User" },
    images: [
      {
        image: { type: String, required: true },
        first: { type: Boolean, default: false },
      },
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

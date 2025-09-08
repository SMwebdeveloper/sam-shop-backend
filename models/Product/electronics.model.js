const Product = require("./product.model");
const { Schema } = require("mongoose");

const ElectronicsProductSchema = new Schema({
  specifications: {
    warranty: {
      duration: Number, // oylarda
      type: String, // "manufacturer", "seller"
      details: String,
    },
    power: {
      input: { type: String, required: true },
      battery: {
        type: String,
        capacity: String,
      },
    },
    dimensions: {
      weight: { type: String },
      size: { type: String },
    },
    features: [String],
  },
  boxContents: [String],
  modelNumber: {
    type: String,
    required: true,
  },
  serialNumber: String,
});

const ElectronicsProduct = Product.discriminator(
  "ElectronicsProduct",
  ElectronicsProductSchema
);
module.exports = { ElectronicsProduct };

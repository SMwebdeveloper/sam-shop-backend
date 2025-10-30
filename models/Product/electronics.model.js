const { Product } = require("./product.model");
const { Schema } = require("mongoose");

const ElectronicsProductSchema = new Schema({
  specifications: {
    warranty: {
      duration: { type: Number }, // oy
      provider: { type: String }, // oldingi `type` -> renamed
      details: { type: String },
    },
    power: {
      input: { type: String },
      battery: {
        batteryType: { type: String }, // oldingi `type` -> renamed
        capacity: { type: String },
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
  },
  serialNumber: String,
});

const ElectronicsProduct = Product.discriminator(
  "ElectronicsProduct",
  ElectronicsProductSchema
);
module.exports = { ElectronicsProduct };

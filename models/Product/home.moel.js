const { Product } = require("./product.model");
const { Schema, model } = require("mongoose");

const HomeProductSchema = new Schema({
  attributes: {
    material: {
      uz: { type: String },
      ru: { type: String },
      en: { type: String },
    },
    color: {
      uz: { type: String },
      ru: { type: String },
      en: { type: String },
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
    },
    roomType: {
      en: {
        type: String,
        enum: [
          "living room",
          "bedroom",
          "kitchen",
          "bathroom",
          "office",
          "other",
        ],
      },
      uz: {
        type: String,
        enum: [
          "yashash xonasi",
          "yotoq xonasi",
          "oshxona",
          "hammom",
          "ofis",
          "boshqa",
        ],
      },
      ru: {
        type: String,
        enum: ["гостиная", "спальня", "кухня", "ванная", "офис", "другой"],
      },
    },
    assemblyRequired: { type: Boolean, default: false }, // yig‘ish kerakmi?
  },
  warranty: {
    duration: Number, // oyda
    details: String,
  },
});
const HomeProduct = Product.discriminator("HomeProduct", HomeProductSchema);

module.exports = { HomeProduct };

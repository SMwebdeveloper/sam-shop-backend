const Product = require("./product.model");
const { Schema } = require("mongoose");
const ClothingProductSchema = new Schema({
  attributes: {
    material: {
      uz: {
        type: String,
        required: true,
        enum: ["paxta", "polister", "jun", "ipak", "jinsi", "teri"],
      },
      ru: {
        type: String,
        required: true,
        enum: ["хлопок", "полиэстер", "шерсть", "шелк", "джинсовая", "кожа"],
      },
      en: {
        type: String,
        required: true,
        enum: ["cotton", "polyester", "wool", "silk", "denim", "leather"],
      },
    },
    fitType: {
      uz: { type: String, enum: ["tor", "normal", "erkin"] },
      ru: { type: String, enum: ["узкий", "обычный", "свободный"] },
      en: { type: String, enum: ["slim", "regular", "loose"] },
    },
    careInstructions: {
      uz: { type: String },
      ru: { type: String },
      en: { type: String },
    },
    originCountry: String,
    sizeGuide: {
      type: Map,
      of: String,
    },
  },
  gender: {
    uz: { type: String, enum: ["erkak", "ayol", "unisex"], required: true },
    ru: {
      type: String,
      enum: ["мужской", "женский", "унисекс"],
      required: true,
    },
    en: {
      type: String,
      enum: ["men", "women", "unisex", "kids"],
      required: true,
    },
  },
  season: {
    uz: { type: String, enum: ["Qish", "Bahor", "Yoz", "Kuz"] },
    ru: { type: String, enum: ["Зима", "Весна", "Лето", "Осень"] },
    en: { type: String, enum: ["Winter", "Spring", "Summer", "Autumn"] },
  },
});
const ClothingProduct = Product.discriminator(
  "ClothingProduct",
  ClothingProductSchema
);
module.exports = {ClothingProduct};
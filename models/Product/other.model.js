const { Product } = require("./product.model");
const { Schema } = require("mongoose");

const OthersProductSchema = new Schema({
  attributes: {
    material: {
      uz: {
        type: String,
        enum: ["plastmassa", "metall", "yog‘och", "qog‘oz", "boshqa"],
      },
      ru: {
        type: String,
        enum: ["пластмасса", "металл", "дерево", "бумага", "другое"],
      },
      en: {
        type: String,
        enum: ["plastic", "metal", "wood", "paper", "other"],
      },
    },
    color: {
      uz: { type: String },
      ru: { type: String },
      en: { type: String },
      hexCode: { type: String },
    },
    brandCountry: {
      uz: { type: String },
      ru: { type: String },
      en: { type: String },
    },
    warranty: {
      duration: Number, // oylar
      description: {
        uz: { type: String },
        ru: { type: String },
        en: { type: String },
      },
    },
    usage: {
      uz: { type: String },
      ru: { type: String },
      en: { type: String },
    },
  },
});
const OtherProduct = Product.discriminator("OtherProduct", OthersProductSchema);

module.exports = { OtherProduct };

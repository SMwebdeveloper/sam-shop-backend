const { Product } = require("./product.model");
const { Schema } = require("mongoose");

const BeautyProductSchema = new Schema(
  {
    attributes: {
      skinType: {
        uz: {
          type: String,
          enum: ["normal", "quruq", "yog‘li", "aralash", "sezgir"],
        },
        ru: {
          type: String,
          enum: [
            "нормальная",
            "сухая",
            "жирная",
            "комбинированная",
            "чувствительная",
          ],
        },
        en: {
          type: String,
          enum: ["normal", "dry", "oily", "combination", "sensitive"],
        },
      },
      hairType: {
        uz: {
          type: String,
          enum: ["normal", "quruq", "yog‘li", "bo‘yalgan", "jingalak"],
        },
        ru: {
          type: String,
          enum: ["нормальные", "сухие", "жирные", "окрашенные", "вьющиеся"],
        },
        en: {
          type: String,
          enum: ["normal", "dry", "oily", "colored", "curly"],
        },
      },
      volume: { type: String },
      ingredients: [
        {
          uz: { type: String },
          ru: { type: String },
          en: { type: String },
        },
      ],
      hypoallergenic: { type: Boolean, default: false },
      expirationDate: Date,
    },
    usageInstructions: {
      uz: { type: String },
      ru: { type: String },
      en: { type: String },
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, rec, options) => {
        const lang = options.lang || "uz";

        if (ret?.attributes?.skinType)
          ret.attributes.skinType = ret.attributes.skinType[lang];
        if (ret?.attributes?.hairType)
          ret.attributes.hairType = ret.attributes.hairType[lang];
        if (ret?.attributes?.ingredients)
          ret.attributes.ingredients = ret.attributes.ingredients[lang];
        if (ret?.usageInstructions)
          ret.usageInstructions = ret.usageInstructions[lang];
      },
    },
  },
);

const BeautyProduct = Product.discriminator(
  "BeautyProduct",
  BeautyProductSchema,
);

module.exports = { BeautyProduct };

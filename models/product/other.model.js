const { Product } = require("./product.model");
const { Schema } = require("mongoose");

const OthersProductSchema = new Schema(
  {
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
      weight: {
        type: Number,
      },
      warranty: {
        duration: {
          type: Number,
        }, // oylar
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
  },
  {
    toJSON: {
      virtuals: true,
      transform: (doc, rec, options) => {
        const lang = options.lang || "uz";
        if (rec?.attributes.material)
          rec.attributes.material = rec.attributes.material[lang];
        if (rec?.attributes.warranty.description)
          rec.attributes.warranty.description =
            rec.attributes.warranty.description[lang];
        if (rec?.attributes.usage)
          rec.attributes.usage = rec.attributes.usage[lang];
      },
    },
  },
);
const OtherProduct = Product.discriminator("OtherProduct", OthersProductSchema);

module.exports = { OtherProduct };

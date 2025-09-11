const { Schema, model } = require("mongoose");
const PriceSchema = require("./price.model");
const {recalcInventory} = require("../../utils/recalcInventory")
// sub categories
const subCategories = {
  uz: {
    kiyim: ["erkaklar", "ayollar", "bolalar", "aksessuarlar"],
    elektronika: ["telefonlar", "noutbuklar", "aksessuarlar", "komponentlar"],
    uy: ["mebel", "dekor", "oshxona"],
    "go'zallik": ["terini parvarish", "makiyaj", "soch parvarishi"],
    boshqa: [],
  },
  ru: {
    одежда: ["мужчины", "женщины", "дети", "аксессуары"],
    электроника: ["телефоны", "ноутбуки", "аксессуары", "компоненты"],
    дом: ["мебель", "декор", "кухня"],
    красота: ["уход за кожей", "макияж", "уход за волосами"],
    другой: [],
  },
  en: {
    clothing: ["men", "women", "kids", "accessories"],
    electronics: ["phones", "laptops", "accessories", "components"],
    home: ["furniture", "decor", "kitchen"],
    beauty: ["skincare", "makeup", "haircare"],
    other: [],
  },
};

//  Main Product Model
const ProductSchema = new Schema(
  {
    // Identifikatsiya va kontent
    name: {
      uz: { type: String, required: true, maxlength: 200 },
      ru: { type: String, required: true, maxlength: 200 },
      en: { type: String, required: true, maxlength: 200 },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      uz: { type: String, required: true, maxlength: 5000 },
      ru: { type: String, required: true, maxlength: 5000 },
      en: { type: String, required: true, maxlength: 5000 },
    },
    shortDescription: {
      uz: { type: String, maxlength: 200 },
      ru: { type: String, maxlength: 200 },
      en: { type: String, maxlength: 200 },
    },

    // Kategoriyalar va tasniflar
    categories: {
      main: {
        uz: {
          type: String,
          required: true,
          enum: ["kiyim", "elektronika", "uy", "go'zallik", "boshqa"],
        },
        ru: {
          type: String,
          required: true,
          enum: ["одежда", "электроника", "дом", "красота", "другой"],
        },
        en: {
          type: String,
          required: true,
          enum: ["clothing", "electronics", "home", "beauty", "other"],
        },
      },
      sub: {
        uz: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return subCategories.uz[this.categories.main.uz].includes(v);
            },
          },
        },
        ru: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return subCategories.ru[this.categories.main.ru].includes(v);
            },
          },
        },
        en: {
          type: String,
          required: true,
          validate: {
            validator: function (v) {
              return subCategories.en[this.categories.main.en].includes(v);
            },
          },
        },
      },
    },
    tags: [{ type: String, index: true }],

    // Narx va inventarizatsiya
    price: {type: PriceSchema},
    priceHistory: [{type: PriceSchema}],
    inventory: {
      variants: [
        {
          color: {
            name: {
              uz: { type: String, required: true },
              ru: { type: String, required: true },
              en: { type: String, required: true },
            },
            hexCode: {type: String, required: true},
            images: [
              {
                url: { type: String, required: true },
                isPrimary: {type: Boolean},
              },
            ],
          },
          sizes: [
            {
              value: { type: String, required: true },
              quantity: { type: Number, default: 0, min: 0 },
              sku: {type: String},
              barcode: {type: String},
              dimensions: {
                length: {type: Number},
                width: {type: Number},
                height: {type: Number},
              },
            },
          ],
          stock: {
            type: Number,
            default: 0,
            min: 0,
          },
        }
      ],
      totalQuantity: {
        type: Number,
        default: 0,
        min: 0,
      },
      lowStockThreshold: {
        type:  Number,
        default: 5,
      },
    },

    // Media
    media: {
      mainImages: [
        {
          url: { type: String, required: true },
          isPrimary: {type: Boolean},
          altText: {type: String},
          order: {type: Number},
        },
      ],
      videos: [
        {
          url: {type: String},
          thumbnail: {type: String},
          title: {type: String},
        },
      ],
    },

    // Sotuv statistikasi
    sales: {
      totalSold: { type: Number, default: 0 },
      lastSoldDate: Date,
      history: [
        {
          date: { type: Date, default: Date.now },
          items: [
            {
              variantId: Schema.Types.ObjectId,
              quantity: {type: Number},
              price: {type: Number},
            },
          ],
        },
      ],
    },

    // Reytinglar va sharhlar
    ratings: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        review: {type: String},
        images: [String],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v) => parseFloat(v.toFixed(1)),
    },

    // Brend va sotuvchi
    brand: {
     uz: {type: String
      },
      ru: {type: String},
      en: {type: String}
    },
    manufacturer: {type: String},
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Boshqaruv va status
    status: {
      uz: {
        type: String,
        enum: ["draft", "active", "inactive", "archived"],
        default: "draft",
        index: true,
      },
      ru: {
        type: String,
        enum: ["draft", "active", "inactive", "archived"],
        default: "draft",
        index: true,
      },
      en: {
        type: String,
        enum: ["draft", "active", "inactive", "archived"],
        default: "draft",
        index: true,
      },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
    publishedAt: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//  Virtual Palace
ProductSchema.virtual("inStock").get(function () {
  return (
    this.inventory.totalQuantity > 0 ||
    this.inventory.variants.some((v) => v.stock > 0)
  );
});

//
// Virtuals
//
ProductSchema.virtual("isDiscountActive").get(function () {
  const now = new Date();
  const discount = this.price?.discount;
  if (!discount) return false;

  return (
    discount.isActive &&
    (!discount.startDate || now >= discount.startDate) &&
    (!discount.endDate || now <= discount.endDate)
  );
});

ProductSchema.virtual("discountedPrice").get(function () {
  const base = this.price?.basePrice ?? 0;
  const discount = this.price?.discount;

  if (!discount || !this.isDiscountActive) return base;

  if (discount.type === "amount") {
    return base - discount.value;
  } else if (discount.type === "percentage") {
    return base * (1 - discount.value / 100);
  }

  return base;
});
// Index
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ "categories.main": 1, "categories.sub": 1 });
ProductSchema.index({ "price.basePrice": 1 });
ProductSchema.index({ "inventory.totalQuantity": 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ status: 1, approved: 1 });

// pre save (create or save())
ProductSchema.pre(["create", "save"], function (next){
  recalcInventory(this)
  next()  
})

// pre update (findOneUpdate, updateOne, updateMany)
ProductSchema.pre(["findOneAndUpdate", "updateOne", "updateMany"], async function (next) {
  const update = this.getUpdate()

  // update only inventory
  if(update && update.inventory) {
    const doc = {inventory: update.inventory}
    recalcInventory(doc)

    // retype update property
    update["inventory.variants"] = doc.inventory.variants
    update["inventory.totalQuantity"] = doc.inventory.totalQuantity 
  }

  next()
})
const Product = model("Product", ProductSchema);

module.exports = { Product };

const { Schema, model } = require("mongoose");

//  1. Narx (Price) Modeli
const PriceSchema = new Schema(
  {
    basePrice: {
      type: Number,
      required: true,
      min: 0,
      set: (v) => parseFloat(v.toFixed(2)), // 2 xona aniqlik
    },
    currency: {
      type: String,
      required: true,
      default: "UZS",
      enum: ["UZS", "USD", "EUR"],
      uppercase: true,
    },
    discount: {
      type: {
        type: String,
        enum: ["amount", "percentage", null],
        default: null,
      },
      value: {
        type: Number,
        min: 0,
        default: 0,
      },
      startDate: {
        type: Date,
        index: true,
      },
      endDate: {
        type: Date,
        validate: {
          validator: function (v) {
            return !this.discount.startDate || v > this.discount.startDate;
          },
          message: "Chegirma tugashi boshlanishidan keyin bo'lishi kerak",
        },
      },
      isActive: {
        type: Boolean,
        default: function () {
          const now = new Date();
          return (
            (!this.startDate || now >= this.startDate) &&
            (!this.endDate || now <= this.endDate)
          );
        },
      },
    },
    tax: {
      rate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      included: {
        type: Boolean,
        default: true,
      },
      type: {
        type: String,
        enum: ["VAT", "SalesTax", null],
        default: null,
      },
    },
  },
  { _id: false }
);

//  2. Asosiy Product Modeli
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
        type: String,
        required: true,
        enum: ["clothing", "electronics", "home", "beauty", "other"],
      },
      sub: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            const subCategories = {
              clothing: ["men", "women", "kids", "accessories"],
              electronics: ["phones", "laptops", "accessories", "components"],
              home: ["furniture", "decor", "kitchen"],
              beauty: ["skincare", "makeup", "haircare"],
              other: [],
            };
            return subCategories[this.categories.main].includes(v);
          },
        },
      },
    },
    tags: [{ type: String, index: true }],

    // Narx va inventarizatsiya
    price: PriceSchema,
    priceHistory: [PriceSchema],
    inventory: {
      variants: [
        {
          color: {
            name: {
              uz: { type: String, required: true },
              ru: { type: String, required: true },
              en: { type: String, required: true },
            },
            hexCode: String,
            images: [
              {
                url: { type: String, required: true },
                isPrimary: Boolean,
              },
            ],
          },
          sizes: [
            {
              value: { type: String, required: true },
              quantity: { type: Number, default: 0, min: 0 },
              sku: String,
              barcode: String,
              dimensions: {
                length: Number,
                width: Number,
                height: Number,
              },
            },
          ],
          stock: {
            type: Number,
            default: 0,
            min: 0,
          },
        },
      ],
      totalQuantity: {
        type: Number,
        default: 0,
        min: 0,
      },
      lowStockThreshold: {
        type: Number,
        default: 5,
      },
    },

    // Media
    media: {
      mainImages: [
        {
          url: { type: String, required: true },
          isPrimary: Boolean,
          altText: String,
          order: Number,
        },
      ],
      videos: [
        {
          url: String,
          thumbnail: String,
          title: String,
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
              quantity: Number,
              price: Number,
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
        review: String,
        images: [String],
        createdAt: { type: Date, default: Date.now },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 1,
      max: 5,
      set: (v) => parseFloat(v.toFixed(1)),
    },

    // Brend va sotuvchi
    brand: {
      type: String,
      index: true,
    },
    manufacturer: String,
    vendor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Boshqaruv va status
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived"],
      default: "draft",
      index: true,
    },
    approved: {
      type: Boolean,
      default: false,
      index: true,
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

//  3. Virtual Maydonlar
ProductSchema.virtual("inStock").get(function () {
  return (
    this.inventory.totalQuantity > 0 ||
    this.inventory.variants.some((v) => v.stock > 0)
  );
});

ProductSchema.virtual("discountedPrice").get(function () {
  if (!this.price.discount.isActive) return this.price.basePrice;

  if (this.price.discount.type === "amount") {
    return this.price.basePrice - this.price.discount.value;
  } else if (this.price.discount.type === "percentage") {
    return this.price.basePrice * (1 - this.price.discount.value / 100);
  }
  return this.price.basePrice;
});

//  4. Indexlar
ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ "categories.main": 1, "categories.sub": 1 });
ProductSchema.index({ "price.basePrice": 1 });
ProductSchema.index({ "inventory.totalQuantity": 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ status: 1, approved: 1 });

//  5. Diskriminator Modellar
// Kiyim Mahsulotlari uchun
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
    uz: { type: String, enum: ["erkak", "ayol", "unisex"] },
    ru: { type: String, enum: ["мужской", "женский", "унисекс"] },
    en: { type: String, enum: ["men", "women", "unisex", "kids"] },
    required: true,
  },
  season: {
    uz: { type: String, enum: ["Qish", "Bahor", "Yoz", "Kuz"] },
    ru: { type: String, enum: ["Зима", "Весна", "Лето", "Осень"] },
    en: { type: String, enum: ["Winter","Spring","Summer","Autumn"]}
  },
});

// Elektronika Mahsulotlari uchun
const ElectronicsProductSchema = new Schema({
  specifications: {
    warranty: {
      duration: Number, // oylarda
      type: String, // "manufacturer", "seller"
      details: String,
    },
    power: {
      input: {type},
      battery: {
        type: String,
        capacity: String,
      },
    },
    dimensions: {
      weight: {type:String},
      size: {type:String},
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

//  6. Modelni Yaratish
const Product = model("Product", ProductSchema);
const ClothingProduct = Product.discriminator(
  "ClothingProduct",
  ClothingProductSchema
);
const ElectronicsProduct = Product.discriminator(
  "ElectronicsProduct",
  ElectronicsProductSchema
);

module.exports = { Product, ClothingProduct, ElectronicsProduct };

const { Schema, model } = require("mongoose");
const NameSchema = require("./name/index");

const shopSchema = new Schema({
  name: NameSchema,
  slug: {
    type: String,
    required: true,
    uniqe: true,
    lowercase: true,
  },
  media: {
    profile: {
      url: { type: String },
      public_id: { type: String },
    },
    banner: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  categories: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  desctiption: {
    uz: { type: String },
    ru: { type: String },
    en: { type: String },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contact: {
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowerCase: true,
    },
    address: {
      uz: { type: String },
      ru: { type: String },
      en: { type: String },
    },
  },
  paymentMethods: {
    cash: { type: Boolean, default: true },
    card: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
  },

  status: {
    type: String,
    enum: ["pending", "active", "suspend", "closed"],
    default: "pending",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  meta: {
    title: {
      uz: String,
      ru: String,
      en: String,
    },
    description: {
      uz: String,
      ru: String,
      en: String,
    },
    keywords: {
      uz: [String],
      ru: [String],
      en: [String],
    },
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 },
  },
  stats: {
    totalProducts: { type: Number, default: 0 },
    activeProducts: { type: Number, default: 0 },
    archivedProducts: { type: Number, default: 0 },
    draftProducts: { type: Number, default: 0 },
    outOfStockProducts: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    returnRate: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
  },
}, {
  timestamps: true
});

module.exports = model("Shop", shopSchema);

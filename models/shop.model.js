const { Schema, model } = require("mongoose");
const NameSchema = require("./name/index");

const shopSchema = new Schema(
  {
    name: NameSchema,
    slug: {
      type: String,
      unique: true,
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
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
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
        required: true,
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
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret, options) => {
        const lang = options.lang || "uz";
        if (ret.name) ret.name = ret.name[lang] || ret.name["uz"];
        if (ret.description)
          ret.description = ret.description[lang] || ret.description["uz"];
        if (ret.contact.address)
          ret.contact.address = ret.address[lang] || red.address["uz"];
        
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

// ========= Instance methods =========
// activate shop
shopSchema.methods.activate = function () {
  this.status = "active";
  this.isVerified = true;
  return this.save();
};

// close shop
shopSchema.methods.close = function () {
  this.status = "closed";
  return this.save();
};

// ========= Virtual fielads =========
shopSchema.virtual("mainName").get(function () {
  return this.name?.uz || this.name?.ru || this.name?.en || "No name";
});

shopSchema.virtual("mainDescription").get(function () {
  return (
    this.description?.uz ||
    this.description?.ru ||
    this.description?.en ||
    "No description"
  );
});

shopSchema.virtual("isActive").get(function () {
  return this.status === "active" && this.isVerified;
});

// ======== Middleware =========
shopSchema.pre("save", async function (next) {
  if (this.isNew) {
    ((this.status = "pending"), (this.isVerified = false));
  }

  if (this.contact.email) {
    this.contact.email = this.contact.email.toLowerCase();
  }

  next();
});

// ======== Indexes ========
// shopSchema.index({ slug: 1 }, { unique: true });
shopSchema.index({ owner: 1, createdAt: -1 });
shopSchema.index({ status: 1, isVerified: 1 });
shopSchema.index({ category: 1, status: 1 });
shopSchema.index({ "rating.average": -1 });

module.exports = model("Shop", shopSchema);

const { Schema, model } = require("mongoose");
const NameSchema = require("./name/index");

const subCategorySchema = new Schema(
  {
    name: NameSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
    slug: { type: String, required: true, lowercase: true, unique: true },
  },
  { timestamps: true, _id: false },
);
const categorySchema = new Schema(
  {
    name: NameSchema,
    isActive: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    sub_categories: [subCategorySchema],
  },

  { timestamps: true },
);

categorySchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.name?.en.tolowerCase().replace(/\s+/g, "-");
  }

  this.sub_categories?.forEach((sub) => {
    if (!sub.slug) {
      sub.slug = sub.name?.en.tolowerCase().replace(/\s+/g, "-");
    }
  });
  next();
});

categorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (update.name && update.name.en && !update.slug) {
    update.slug = update.name?.en.tolowerCase().replace(/\s+/g, "-");
  }

  if (update.$addToSet && update.$addToSet.sub_categories) {
    const sub = update.$addToSet.sub_categories;

    if (sub.name && sub.name?.en && !sub.slug) {
      sub.slug = sub.name.en.tolwerCase().replace(/\s+/g, "-");
    }
  }
  next();
});

module.exports = model("Category", categorySchema);

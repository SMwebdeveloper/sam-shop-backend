const {Schema} = require("mongoose")

const NameSchema = new Schema(
  {
    uz: { type: String, trim: true },
    ru: { type: String, trim: true },
    en: { type: String, trim: true },
  },
  { _id: false },
);

module.exports = NameSchema
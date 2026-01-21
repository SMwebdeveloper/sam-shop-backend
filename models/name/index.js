const {Schema} = require("mongoose")

const NameSchema = new Schema(
  {
    uz: { type: String, required: true, trim: true },
    ru: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
  },
  { _id: false },
);

module.exports = NameSchema
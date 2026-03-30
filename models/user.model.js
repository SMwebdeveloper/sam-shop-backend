const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      uz: { type: String, enum: ["admin", "foydalanuvchi", "sotuvchi"] },
      ru: { type: String, enum: ["админ", "пользователь", "продавец"] },
      en: { type: String, enum: ["admin", "user", "seller"] },
    },
    likes: [
      {
        product: Schema.Types.ObjectId,
      },
    ],
    basket: [
      {
        product: Schema.Types.ObjectId,
      },
    ],
    isVerfiyed: { type: Boolean },
  },
  { timestamps: true },
);

module.exports = model("User", UserSchema);

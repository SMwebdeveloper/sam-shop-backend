const { Schema, model } = require("mongoose");

const OtpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expireAt: { type: Date },
});

module.exports = model("Otp", OtpSchema);

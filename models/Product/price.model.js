const { Schema } = require("mongoose");

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

module.exports = PriceSchema;

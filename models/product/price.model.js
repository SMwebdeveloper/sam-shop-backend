const { Schema } = require("mongoose");

const PriceSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
      set: (v) => parseFloat(v.toFixed(2)), // 2 xona aniqlik
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
      taxType: {
        type: String,
        enum: ["VAT", "SalesTax", null],
        default: null,
      },
    },
  },
  { _id: false }
);

module.exports = PriceSchema;

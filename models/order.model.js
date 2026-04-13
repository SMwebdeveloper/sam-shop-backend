const { Schema, model } = require("mongoose");

// order product item
const productItem = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  shop: {
    type: Schema.Types.ObjectId,
    ref: "Shop",
    required: true,
  },
  name: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  image: { type: String },
});

// order items
const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [productItem],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cash", "card", "online"],
    },
    paymentResult: {
      id: String,
      status: {type: String, enum: ['completed', 'proccessing'], default: "proccessing"},
      update_time: String,
      email_address: String,
    },
    itemPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      deafult: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliviredAt: {
      type: Date,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ["shipped", "delivered", "cancelled"],
      default: "shipped",
    },
    returnProduct: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          min: 1,
        },
        reason: {
          type: String,
          enum: ["defective", "wrong_item", "changed_mind"],
        },
        status: {
          type: String,
          enum: ["approved", "rejected", "refunded"],
        },
        requestAt: {
          type: Date,
          default: Date.now,
        },
        refundedAt: Date,
      },
    ],
    refundedTotal: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  toJSON: {
    transform: (doc, ret, options) => {
      const lang = options.lang || "uz";
      if(ret?.product.name){
        ret.product.name = ret.product.name[lang] || ret.product.name['uz']
      }
      if(ret?.shop.name) {
        ret.shop.name = ret.shop.name[lang] || ret.shop.name['uz']
      }
      return ret
    },
  },
  },
);

module.exports = model("Order", orderSchema);

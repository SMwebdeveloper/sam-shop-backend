const { body } = require("express-validator");
const i18n = require("../utils/i18n");

const orderValidations = {
  create: (locale) => {
    const t = i18n(locale, "order");

    return [
      body("user").notEmpty().withMessage(t("user_required")),
      body("orderItems[0].product")
        .notEmpty()
        .withMessage(t("product_required")),
      body("orderItems[0].shop").notEmpty().withMessage(t("shop_required")),
      body("orderItems[0].name").notEmpty().withMessage(t("product_name")),
      body("orderItems[0].price").notEmpty().withMessage(t("product_price")),
      body("shippingAddres.address")
        .notEmpty()
        .withMessage(t("address_required")),
      body("shippingAddress.city").notEmpty().withMessage(t("city_required")),
      body("shippingAddress.phone").notEmpty().withMessage(t("phone_required")),
      body("shippingAddress.postCode")
        .notEmpty()
        .withMessage(t("post_required")),
      body("paymentMethod").notEmpty().withMessage(t("payment_method")),
      body("itemPrice").notEmpty().withMessage(t("item_price")),
      body("totalPrice").notEmpty().withMessage(t("total_price")),
      body("shippingPrice").notEmpty().withMessage(t("shippin_price")),
      body("isPaid").notEmpty().withMessage(t("is_paid")),
      body("orderStatus").notEmpty().withMessage("order_status"),
    ];
  },
};

module.exports = orderValidations
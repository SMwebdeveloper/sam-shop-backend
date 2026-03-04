const { body } = require("express-validator");
const i18n = require("../utils/i18n");

const categoryValidations = {
  create: (locale) => {
    const t = i18n(locale, "category");

    return [
      body("name").notEmpty().withMessage(t("category_name")),

      body("sub_categories").notEmpty().withMessage(t("sub_category_name")),
    ];
  },
  updateCategory: (locale) => {
    const t = i18n(locale, "category");

    return [
      body("name").notEmpty().withMessage(t("category_name")),

      body("sub_categories").notEmpty().withMessage(t("sub_category_name")),
    ];
  },
};

module.exports = categoryValidations;

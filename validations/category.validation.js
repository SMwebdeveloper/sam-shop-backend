const { body } = require("express-validator");
const { getLanguage } = require("../utils/getLanguage");
const i18n = require("../utils/i18n");

const categoryValidations = {
  create: (locale) => {
    const lang = getLanguage(locale);
    const t = i18n(lang, "category");

    return [
      body("name").notEmpty().withMessage(t("category_name")),

      body("sub_categories").notEmpty().withMessage(t("sub_category_name")),
    ];
  },
  updateCategory: (locale) => {
    const lang = getLanguage(locale);
    const t = i18n(lang, "category");

    return [
      body("name").notEmpty().withMessage(t("category_name")),

      body("sub_categories").notEmpty().withMessage(t("sub_category_name")),
    ];
  },
};

module.exports = categoryValidations;

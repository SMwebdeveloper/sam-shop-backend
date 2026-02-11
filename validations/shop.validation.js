const { body } = require("express-validator");
const { getLanguage } = require("../utils/getLanguage");
const i18n = require("../utils/i18n");

function langHelper(lang) {
  const l = getLanguage(lang);
  const t = i18n(l, "shop");
  return { t };
}

const shopValidations = {
  create: (locale) => {
    const { t } = langHelper(locale);

    return [
      body("name")
        .notEmpty()
        .withMessage(t("name"))
        .bail()
        .isLength({ min: 2, max: 30 })
        .withMessage(t("name_length")),

      body("description")
        .notEmpty()
        .withMessage(t("description"))
        .bail()
        .isLength({ min: 10, max: 300 }),

      body("category").notEmpty().withMessage(t("category")),
      body("owner").notEmpty().withMessage(t("category")),
      body("contact.phone")
        .notEmpty()
        .withMessage(t("phone"))
        .bail()
        .matches(/^\+?[1+9]\d{1,14}$/)
        .withMessage(t("phone_invalid")),
      body("contact.email")
        .notEmpty()
        .withMessage(t("email"))
        .bail()
        .isEmail()
        .withMessage(t("email_invalid")),
    ];
  },
};

module.exports = shopValidations;

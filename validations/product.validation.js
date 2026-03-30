const { body } = require("express-validator");
const i18n = require("../utils/i18n");

const productValidation = {
  create: (locale) => {
    const t = i18n(locale, "product");

    return [
      body("name")
        .notEmpty()
        .withMessage(t("name_required"))
        .bail()
        .isObject()
        .isLength({ min: 2, max: 30 })
        .withMessage(t("name_length"))
        .bail()
        .custom((value) => {
          const requiredLang = ["uz", "en", "ru"];
          const missingLang = [];

          for (const lang of requiredLang) {
            if (!value[lang] || value[lang].trim() === "") {
              missingLang.push(lang.toUpperCase());
            }
          }

          if (missingLang.length > 0) {
            throw new Error(`${missingLang.join(", ")} ${t("name_required")}`);
          }

          for (const lang of requiredLang) {
            if (value[lang].length < 2 || value[lang].length > 30) {
              throw new Error(t("name_length"));
            }
          }

          return true;
        }),
    ];
  },
};

module.exports = productValidation;

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
            throw new Error(`${missingLang.join(", ")} ${t("name")}`);
          }

          for (const lang of requiredLang) {
            if (value[lang].length < 2 || value[lang].length > 30) {
              throw new Error(t("name_length"));
            }
          }

          return true;
        }),
      body("description")
        .notEmpty()
        .withMessage(t("description"))
        .bail()
        .isObject()
        .isLength({ min: 10, max: 300 })
        .bail()
        .custom((value) => {
          const requiredLangs = ["uz", "ru", "en"];
          const missingLangs = [];

          for (const lang of requiredLangs) {
            if (!value[lang] || value[lang].trim() === "") {
              missingLangs.push(lang.toUpperCase());
            }
          }

          if (missingLangs.length > 0) {
            throw new Error(`${missingLangs.join(", ")} ${t("description")}`);
          }

          // Har bir til uchun uzunlikni tekshirish
          for (const lang of requiredLangs) {
            if (value[lang].length < 10 || value[lang].length > 300) {
              throw new Error(t("description_length"));
            }
          }

          return true;
        }),
      body("category").notEmpty().withMessage(t("category")),
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
  update: (locale) => {
    const { t } = langHelper(locale);

    return [
      body("name")
        .notEmpty()
        .withMessage(t("name"))
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
            throw new Error(`${missingLang.join(", ")} ${t("name")}`);
          }

          for (const lang of requiredLang) {
            if (value[lang].length < 2 || value[lang].length > 30) {
              throw new Error(t("name_length"));
            }
          }

          return true;
        }),
      body("description")
        .notEmpty()
        .withMessage(t("description"))
        .bail()
        .isObject()
        .isLength({ min: 10, max: 300 })
        .bail()
        .custom((value) => {
          const requiredLangs = ["uz", "ru", "en"];
          const missingLangs = [];

          for (const lang of requiredLangs) {
            if (!value[lang] || value[lang].trim() === "") {
              missingLangs.push(lang.toUpperCase());
            }
          }

          if (missingLangs.length > 0) {
            throw new Error(`${missingLangs.join(", ")} ${t("description")}`);
          }

          // Har bir til uchun uzunlikni tekshirish
          for (const lang of requiredLangs) {
            if (value[lang].length < 10 || value[lang].length > 300) {
              throw new Error(t("description_length"));
            }
          }

          return true;
        }),
      body("category").notEmpty().withMessage(t("category")),
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

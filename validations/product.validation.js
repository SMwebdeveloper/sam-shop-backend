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
        .withMessage(t("name_maxLength"))
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
              throw new Error(t("name_maxLength"));
            }
          }

          return true;
        }),

      body("description")
        .notEmpty()
        .withMessage(t("description_required"))
        .bail()
        .isObject()
        .isLength({ min: 50, max: 5000 })
        .withMessage(t("description_maxLength"))
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
            throw new Error(
              `${missingLangs.join(", ")} ${t("description_required")}`,
            );
          }

          for (const lang of requiredLangs) {
            if (value[lang].length < 10 || value[lang].length > 5000) {
              throw new Error(t("description_maxLength"));
            }
          }

          return true;
        }),

      body("shortDescription")
        .notEmpty()
        .withMessage(t("shortDescription_required"))
        .bail()
        .isObject()
        .isLength({ min: 50, max: 200 })
        .withMessage(t("shortDescription_maxLength"))
        .custom((value) => {
          const requiredLangs = ["uz", "ru", "en"];
          const missingLangs = [];

          for (const lang of requiredLangs) {
            if (!value[lang] || value[lang].trim() === "") {
              missingLangs.push(lang.toUpperCase());
            }
          }

          if (missingLangs.length > 0) {
            throw new Error(
              `${missingLangs.join(", ")} ${t("shortDescription_required")}`,
            );
          }

          for (const lang of requiredLangs) {
            if (value[lang].length < 10 || value[lang].length > 5000) {
              throw new Error(t("shortDescription_maxLength"));
            }
          }

          return true;
        }),

      body("category.main")
        .notEmpty()
        .withMessage(t("category_main_required"))
        .bail()
        .isObject()
        .custom((value) => {
          const requiredLangs = ["uz", "ru", "en"];
          const missingLangs = [];

          for (const lang of requiredLangs) {
            if (!value[lang] || value[lang].trim() === "") {
              missingLangs.push(lang.toUpperCase());
            }
          }

          if (missingLangs.length > 0) {
            throw new Error(
              `${missingLangs.join(", ")} ${t("category_main_required")}`,
            );
          }

          return true;
        }),

      body("category.sub")
        .notEmpty()
        .withMessage(t("category_sub_required"))
        .bail()
        .isObject()
        .custom((value) => {
          const requiredLangs = ["uz", "ru", "en"];
          const missingLangs = [];

          for (const lang of requiredLangs) {
            if (!value[lang] || value[lang].trim() === "") {
              missingLangs.push(lang.toUpperCase());
            }
          }

          if (missingLangs.length > 0) {
            throw new Error(
              `${missingLangs.join(", ")} ${t("category_sub_required")}`,
            );
          }

          return true;
        }),
      body("price.amount").notEmpty().withMessage(t("price_required")),
      body("vendor").notEmpty().withMessage(t("vendor_required")),
      body("inventory.vairants.*.color.name")
        .notEmpty()
        .withMessage(t("color_name_required")),
      body("inventory.variants.*.color.hexCode")
        .notEmpty()
        .optional()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage(t("color_hexCode_required")),
      body("inventory.variants.*.size.value")
        .notEmpty()
        .withMessage(t("size_value_required")),
      body("media.mainImages")
        .notEmpty()
        .withMessage(t("product_url_required")),
    ];
  },
  update: (locale) => {
    const t = i18n(locale, "product");

    return [
      body("name")
        .notEmpty()
        .withMessage(t("name_required"))
        .bail()
        .isObject()
        .isLength({ min: 2, max: 30 })
        .withMessage(t("name_maxLength"))
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
              throw new Error(t("name_maxLength"));
            }
          }

          return true;
        }),

      body("description")
        .notEmpty()
        .withMessage(t("description_required"))
        .bail()
        .isObject()
        .isLength({ min: 50, max: 5000 })
        .withMessage(t("description_maxLength"))
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
            throw new Error(
              `${missingLangs.join(", ")} ${t("description_required")}`,
            );
          }

          for (const lang of requiredLangs) {
            if (value[lang].length < 10 || value[lang].length > 5000) {
              throw new Error(t("description_maxLength"));
            }
          }

          return true;
        }),

      body("shortDescription")
        .notEmpty()
        .withMessage(t("shortDescription_required"))
        .bail()
        .isObject()
        .isLength({ min: 50, max: 200 })
        .withMessage(t("shortDescription_maxLength"))
        .custom((value) => {
          const requiredLangs = ["uz", "ru", "en"];
          const missingLangs = [];

          for (const lang of requiredLangs) {
            if (!value[lang] || value[lang].trim() === "") {
              missingLangs.push(lang.toUpperCase());
            }
          }

          if (missingLangs.length > 0) {
            throw new Error(
              `${missingLangs.join(", ")} ${t("shortDescription_required")}`,
            );
          }

          for (const lang of requiredLangs) {
            if (value[lang].length < 10 || value[lang].length > 5000) {
              throw new Error(t("shortDescription_maxLength"));
            }
          }

          return true;
        }),

      body("category.main")
        .notEmpty()
        .withMessage(t("category_main_required"))
        .bail()
        .isObject()
        .custom((value) => {
          const requiredLangs = ["uz", "ru", "en"];
          const missingLangs = [];

          for (const lang of requiredLangs) {
            if (!value[lang] || value[lang].trim() === "") {
              missingLangs.push(lang.toUpperCase());
            }
          }

          if (missingLangs.length > 0) {
            throw new Error(
              `${missingLangs.join(", ")} ${t("category_main_required")}`,
            );
          }

          return true;
        }),

      body("category.sub")
        .notEmpty()
        .withMessage(t("category_sub_required"))
        .bail()
        .isObject()
        .custom((value) => {
          const requiredLangs = ["uz", "ru", "en"];
          const missingLangs = [];

          for (const lang of requiredLangs) {
            if (!value[lang] || value[lang].trim() === "") {
              missingLangs.push(lang.toUpperCase());
            }
          }

          if (missingLangs.length > 0) {
            throw new Error(
              `${missingLangs.join(", ")} ${t("category_sub_required")}`,
            );
          }

          return true;
        }),
      body("price.amount").notEmpty().withMessage(t("price_required")),
      body("vendor").notEmpty().withMessage(t("vendor_required")),
      body("inventory.vairants.*.color.name")
        .notEmpty()
        .withMessage(t("color_name_required")),
      body("inventory.variants.*.color.hexCode")
        .notEmpty()
        .optional()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
        .withMessage(t("color_hexCode_required")),
      body("inventory.variants.*.size.value")
        .notEmpty()
        .withMessage(t("size_value_required")),
      body("media.mainImages")
        .notEmpty()
        .withMessage(t("product_url_required")),
    ];
  },
};

module.exports = productValidation;

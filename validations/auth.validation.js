const { body } = require("express-validator");
const { getLanguage } = require("../utils/getLanguage");
const i18n = require("../utils/i18n");

const authValidations = {
  register: (locale) => {
    const lang = getLanguage(locale);
    console.log(lang)
    const t = i18n(lang, "auth");

    return [
      body("username")
        .notEmpty()
        .bail()
        .withMessage(t("username_required"))
        .isLength({ min: 2, max: 30 })
        .withMessage(t("username_length")),

      body("email")
        .notEmpty()
        .bail()
        .withMessage(t("email_required"))
        .isEmail()
        .withMessage(t("email_invalid")),

      body("password")
        .notEmpty()
        .bail()
        .withMessage(t("password_required"))
        .isLength({ min: 6 })
        .withMessage(t("password_length")),
    ];
  },
  login: (locale) => {
    const lang = getLanguage(locale);
    const t = i18n(lang, "auth");

    return [
      body("email")
        .notEmpty()
        .bail()
        .withMessage(t("email_required"))
        .isEmail()
        .withMessage(t("email_invalid")),

      body("password")
        .notEmpty()
        .bail()
        .withMessage(t("password_required"))
        .isLength({ min: 6 })
        .withMessage(t("password_length")),
    ];
  },
  resetPassword: (locale) => {
    const lang = locale?.split("-")[0]?.toLowerCase() || "uz";
    const t = i18n(lang, "auth");

    return [
      body("email")
        .notEmpty()
        .bail()
        .withMessage(t("email_required"))
        .isEmail()
        .withMessage(t("email_invalid")),
    ];
  },
  verify: (locale) => {
    const lang = getLanguage(locale);
    const t = i18n(lang, "auth");
    return [
      body("email")
        .notEmpty()
        .bail()
        .withMessage(t("email_required"))
        .isEmail()
        .withMessage(t("email_invalid")),

      body("otp")
        .notEmpty()
        .bail()
        .withMessage(t("otp_required"))
        .isLength({ min: 6, max: 6 })
        .withMessage(t("otp_length"))
        .isNumeric()
        .withMessage(t("otp_required")),
    ];
  },
  recoveryAccount: (locale) => {
    const lang = getLanguage(locale);
    const t = i18n(lang, "auth");

    return [
      body("token").notEmpty()
      .bail().withMessage(t("token_required")),

      body("password")
        .notEmpty()
        .bail()
        .withMessage(t("password_required"))
        .isLength({ min: 6 })
        .withMessage(t("password_length")),
    ];
  },
};

module.exports = authValidations;

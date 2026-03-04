const { body } = require("express-validator");
const i18n = require("../utils/i18n");

const authValidations = {
  register: (locale) => {
    const t = i18n(locale, "auth");

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
    const t = i18n(locale, "auth");

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
    const t = i18n(locale, "auth");

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
    const t = i18n(locale, "auth");
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
    const t = i18n(locale, "auth");

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

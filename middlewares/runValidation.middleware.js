// middlewares/runValidation.middleware.js
const { validationResult } = require("express-validator");
const i18n = require("../utils/i18n");
const { getLanguage } = require("../utils/getLanguage");

const validateRequest = () => {
  return (req, res, next) => {
    const errors = validationResult(req);
    const lang = getLanguage(req.headers["accept-language"]);
    const t = i18n(lang, "common");

    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg || err.message,
      value: err.value,
    }));

    return res.status(400).json({
      success: false,
      message: t("validation_error") || "Validation error",
      errors: formattedErrors,
    });
  };
};

module.exports = validateRequest;

// middlewares/validate.middleware.js
const authValidations = require("../validations/auth.validation");
const kebabToCamel =  require("../utils/caseConvert")

const validationMiddleware = (req, res, next) => {
  const type = req.route.path.substring(1); // route nomini olish
  const validationKey = kebabToCamel(type)

  if (authValidations[validationKey]) {
    const locale = req.headers["accept-language"] || "uz";
    const validations = authValidations[validationKey](locale);

    // Validation chain'ni ishga tushirish
    Promise.all(validations.map((validation) => validation.run(req)))
      .then(() => next())
      .catch(next);
  } else {
    next();
  }
};

module.exports = validationMiddleware;

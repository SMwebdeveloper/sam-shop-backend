// middlewares/validate.middleware.js
const authValidations = require("../validations/auth.validation");
const categoryValidations = require("../validations/category.validation")
const kebabToCamel = require("../utils/caseConvert");

const validationModule = {
  auth: authValidations,
  category: categoryValidations
};
const validationMiddleware = (moduleName) => {
  return (req, res, next) => {
    const type = req.route.path.substring(1); // route nomini olish
    const validationKey = kebabToCamel(type);
    const moduleValidations = validationModule[moduleName];
    if (moduleValidations[validationKey]) {
      const locale = req.headers["accept-language"] || "uz";
      const validations = moduleValidations[validationKey](locale);

      // Validation chain'ni ishga tushirish
      Promise.all(validations.map((validation) => validation.run(req)))
        .then(() => next())
        .catch(next);
    } else {
      next();
    }
  };
};

module.exports = validationMiddleware;

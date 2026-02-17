// middlewares/validate.middleware.js
const authValidations = require("../validations/auth.validation");
const categoryValidations = require("../validations/category.validation");
const shopValidations = require("../validations/shop.validation");
const kebabToCamel = require("../utils/caseConvert");

const validationModule = {
  auth: authValidations,
  category: categoryValidations,
  shop: shopValidations,
};
const validationMiddleware = (moduleName) => {
  return (req, res, next) => {
    const type = req.route.path.substring(1); // route nomini olish
    const validationKey = kebabToCamel(type);
    const moduleValidations = validationModule[moduleName];
    if (moduleValidations[validationKey]) {
      const locale = req.lang;
      const validations = moduleValidations[validationKey](locale);
      console.log(validationKey);
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

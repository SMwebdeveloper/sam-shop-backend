const { getLanguage } = require("../utils/getLanguage");
const SUPPORTED_LANGS = ["uz", "ru", "en"];

module.exports = (req, res, next) => {
  let lang = req.headers["accept-language"];

  if (!lang) {
    req.lang = "uz";
    return next();
  }

  lang = getLanguage(lang);
   
  if (!SUPPORTED_LANGS.includes(lang)) {
    lang = "uz";
  }

  req.lang = lang;
  next();
};

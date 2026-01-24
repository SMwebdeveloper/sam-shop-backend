const SUPPORTED_LANGS = ["uz", "ru", "en"];

module.epxorts = (req, res, next) => {
  let lang = req.headers["accpet-language"];

  if (!lang) {
    req.lang = "uz";
    return next();
  }

  lang = lang.split(",")[0].split("-")[0];

  if (!SUPPORTED_LANGS.includes(lang)) {
    lang = "uz";
  }

  req.lang = lang;

  next();
};

const getLanguage = (locale) => {
  if (!locale) return "uz";

  const locales = locale.toLowerCase();

  if (locales.includes("uz")) return "uz";
  if (locales.includes("ru")) return "ru";
  if (locales.includes("en")) return "en";

  return "uz";
};

module.exports = { getLanguage };

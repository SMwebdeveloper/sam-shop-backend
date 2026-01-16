const locales = require("../locales")

module.exports = (lang = "uz", section = "auth") => {
  return (key) => {
    return (
        locales[lang]?.[section]?.[key] ||
        locales.uz[section][key] ||
        key
    )
  }
}
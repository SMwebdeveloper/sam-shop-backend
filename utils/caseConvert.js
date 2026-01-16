const kebabToCamel = (str) => {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

module.exports = kebabToCamel
function recalcInventory(doc) {
  let total = 0;
  if (!doc.inventory || !doc.inventory.variants) return;

  doc.inventory.variants.forEach((variant) => {
    let variantStock = 0;

    if (variant.sizes) {
      variant.sizes.forEach((size) => {
        variantStock += size.quantity;
      });
    }

    variant.stock = variantStock;

    total = variantStock;
  });

  doc.totalQuantity = total;
}

module.exports = { recalcInventory };

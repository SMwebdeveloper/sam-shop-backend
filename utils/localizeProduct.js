const localizeProduct = (product, lang = "uz") => {
  if (!product) return null;

  const localized = {
    id: product._id,
    name: product.name?.[lang] || product.name?.uz,
    description: product.description?.[lang] || product.description.uz,
    shortDescription:
      product.shortDescription?.[lang] || product.shortDescription?.uz,
    categories: {
      main: product.categories?.main?.[lang] || product.categories?.main?.uz,
      sub: product.categories?.sub?.[lang] || product.categories?.sub?.uz,
    },
    price: product.price,
    brand: product.brand?.[lang] || product.brand?.uz,
    status: product.status?.[lang] || product.status?.uz,
    featured: product.featured,
    inventory: product.inventory,
    media: product.media,
    tags: product.tags,
    vendor: product.vendor,
    averageRating: product.averageRating,
    inStock: product.inStock,
    isDiscountActive: product.isDiscountActive,
    discountedPrice: product.discountedPrice,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  switch (product.__t) {
    case "BeautyProduct":
      localized.attributes = localizeBeautyProduct(product, lang);
      localized.usageInstructions = localizeBeautyProduct(
        product,
        lang
      ).usageInstructions;
      break;
    case "ElectronicsProduct":
      localized.specifications = localizeElectronicProduct(product, lang);
      localized.boxContents = product.boxContents;
      localized.modelNumber = product.modelNumber;
      localized.serialNumber = product.serialNumber;
      break;
    case "ClothingProduct":
      localized.attributes = localizeClothingProduct(product, lang).attributes;
      localized.gender = localizeClothingProduct(product, lang).gender;
      localized.season = localizeClothingProduct(product, lang).season;
      break;
    case "HomeProduct":
      localized.attributes = localizeHomeProduct(product, lang).attributes;
      localized.warranty = localizeHomeProduct(product, lang).warranty;
      break;
    case "OtherProduct":
      localized.attributes = localizeOtherProduct(product, lang).attributes;
      break;

    default:
        localized.attributes = product.attributes;
      break;
  }

  return localized;
};

function localizeBeautyProduct(product, lang = "uz") {
  return {
    skinType:
      product.attributes?.skinType?.[lang] || product.attributes?.skinType?.uz,
    hairType:
      product.attributes?.hairType?.[lang] || product.attributes?.hairType?.uz,
    volume: product.attributes?.volume,
    ingredients:
      product.attributes?.ingredients?.[lang] ||
      product.attributes?.ingredients?.uz,
    hypoallergenic: product.attributes?.hypoallergenic,
    expirationDate: product.attributes?.expirationDate,
  };
}

function localizeElectronicProduct(product, lang = "uz") {
  return {
    warranty: {
      duration: product.warranty?.duration,
      provider: product.warranty?.provider,
      details:
        product.warranty?.details?.[lang] || product.warranty?.details?.uz,
    },
    power: {
      input: product.power?.input,
      battery: {
        batteryType: product.battery?.batteryType,
        capacity: product.battery?.capacity,
      },
    },
    dimensions: {
      weight: product.dimensions?.weight,
      size: product.dimensions?.size,
    },
    features: product.features,
  };
}

function localizeClothingProduct(product, lang = "uz") {
  return {
    attributes: {
      material:
        product.attributes?.material?.[lang] ||
        product.attributes?.material?.uz,
      fitType:
        product.attributes?.fitType?.[lang] || product.attributes?.fitType?.uz,
      careInstructions:
        product.attributes?.careInstructions?.[lang] ||
        product.attributes?.careInstructions?.uz,
      originCountry: product.attributes?.originCountry,
      sizeGuide: product.attributes?.sizeGuide,
    },
    gender: product.gender?.[lang] || product.gender?.uz,
    season: product.season?.[lang] || product.season?.uz,
  };
}

function localizeHomeProduct(product, lang = "uz") {
  return {
    attributes: {
      material:
        product.attributes?.material?.[lang] ||
        product.attributes?.material?.uz,
      color: product.attributes?.color?.[lang] || product.attributes?.color?.uz,
      dimensions: product.attributes?.dimensions,
      roomType:
        product.attributes?.roomType?.[lang] ||
        product.attributes?.roomType?.uz,
      assemblyRequired: product.attributes?.assemblyRequired,
    },
    warranty: {
      duration: product.warranty?.duration,
      details: product.warranty?.details,
    },
  };
}

function localizeOtherProduct(product, lang = "uz") {
  return {
    attributes: {
      material:
        product.attributes?.material?.[lang] ||
        product.attributes?.material?.uz,
      color: {
        name:
          product.attributes?.color?.name?.[lang] ||
          product.attributes?.color?.name?.uz,
        hexCode: product.attributes?.color?.hexCode,
      },
      brandCountry:
        product.attributes?.brandCountry?.[lang] ||
        product.attributes?.brandCountry?.uz,
      warranty: {
        duration,
      },
    },
  };
}


module.exports = localizeProduct
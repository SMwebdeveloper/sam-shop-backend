const defaultCategories = [
  {
    name: {
      uz: "Kiyim",
      ru: "Одежда",
      en: "Clothing",
    },
    sub_categories: [
      {
        name: { uz: "Erkaklar", ru: "Мужчины", en: "Men" },
        slug: "men",
      },
      {
        name: { uz: "Ayollar", ru: "Женщины", en: "Women" },
        slug: "women",
      },
      {
        name: { uz: "Bolalar", ru: "Дети", en: "Kids" },
        slug: "kids",
      },
      {
        name: { uz: "Aksessuarlar", ru: "Аксессуары", en: "Accessories" },
        slug: "accessories",
      },
    ],
    slug: "clothing",
  },
  {
    name: {
      uz: "Elektronika",
      ru: "Электроника",
      en: "Electronics",
    },
    sub_categories: [
      {
        name: { uz: "Telefonlar", ru: "Телефоны", en: "Phones" },
        slug: "phones",
      },
      {
        name: { uz: "Noutbuklar", ru: "Ноутбуки", en: "Laptops" },
        slug: "laptops",
      },
      {
        name: { uz: "Aksessuarlar", ru: "Аксессуары", en: "Accessories" },
        slug: "electronics-accessories",
      },
      {
        name: { uz: "Komponentlar", ru: "Компоненты", en: "Components" },
        slug: "components",
      },
    ],
    slug: "electronics",
  },
  {
    name: {
      uz: "Uy",
      ru: "Дом",
      en: "Home",
    },
    sub_categories: [
      {
        name: { uz: "Mebel", ru: "Мебель", en: "Furniture" },
        slug: "furniture",
      },
      {
        name: { uz: "Dekor", ru: "Декор", en: "Decor" },
        slug: "decor",
      },
      {
        name: { uz: "Oshxona", ru: "Кухня", en: "Kitchen" },
        slug: "kitchen",
      },
    ],
    slug: "home",
  },
  {
    name: {
      uz: "Go'zallik",
      ru: "Красота",
      en: "Beauty",
    },
    sub_categories: [
      {
        name: { uz: "Teriya parvarishi", ru: "Уход за кожей", en: "Skincare" },
        slug: "skincare",
      },
      {
        name: { uz: "Makiyaj", ru: "Макияж", en: "Makeup" },
        slug: "makeup",
      },
      {
        name: { uz: "Soch parvarishi", ru: "Уход за волосами", en: "Haircare" },
        slug: "haircare",
      },
    ],
    slug: "beauty",
  },
  {
    name: {
      uz: "Boshqa",
      ru: "Другое",
      en: "Other",
    },
    sub_categories: [],
    slug: "other",
  },
];

module.exports = defaultCategories;

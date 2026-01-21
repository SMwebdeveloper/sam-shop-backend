const Category = require("../models/category.model");
const BaseError = require("../errors/base.error");
class CategoryService {
  async getAllCategories(lang = "uz") {
    let categories = await Category.find({ isActive: true })
      .select(
        `name.${lang} sub_categories.name.${lang} sub_categories.slug slug isActive`,
      )
      .lean();

    return (categories = categories.map((item) => {
      return {
        ...item,
        name: item.name[lang],
        sub_categories: item.sub_categories.map((item2) => ({
          ...item2,
          name: item2.name[lang],
        })),
      };
    }));
  }
}

module.exports = new CategoryService();

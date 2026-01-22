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
  async createCategory(data, lang) {
    const existingCategory = Category.find({ slug: data.slug });

    if (existingCategory) {
      const messages = {
        uz: "Bu nom bilan categoriya mavjud iltimos boshqa nom tanglang",
        ru: "Категория с таким названием уже существует, пожалуйста, выберите другое название.",
        en: "A category with this name already exists, please choose another name.",
      };

      const message = messages[lang];
      throw BaseError.Conflict(message, lang);
    }

    const slug = data.name.en.toLowerCase().replace(/\s+/g, "-");
    const processedSubCategories = data.sub_categories.map((sub) => {
      if (!sub.name.en || !sub.name.uz || !sub.name.ru) {
        return false;
      }
      return {
        name: sub.name,
        slug: sub.name.en.toLowerCase().replace(/\s+/g, "-"),
      };
    });

    const category = await Category.create({
      name: data.name,
      sub_categories: processedSubCategories,
      slug,
    });

    return {
      success: true,
      message: "Muvafaqiyatli yaratilid",
      data: category,
    };
  }

  async getCategoryById(id, lang) {
    const category = await Category.findById(id);
    if (!category) {
      throw BaseError.NotFound(_, lang);
    }

    return category;
  }
  async updateCategory(data, id, lang) {
    await this.getCategoryById(id);
    if (data.name && data.name.en) {
      data.slug = data?.name?.en.toLowerCase().replace(/\s+/g, "-");
    }

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return category
  }
}

module.exports = new CategoryService();

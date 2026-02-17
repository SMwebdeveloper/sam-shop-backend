const mongoose = require("mongoose");
const BaseError = require("../errors/base.error");

//model
const Category = mongoose.model("Category");
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
    const slug = data.name.en.toLowerCase().replace(/\s+/g, "-");
    const existingCategory = await Category.find({ slug });

    if (existingCategory.length > 0) {
      const messages = {
        uz: "Bu nom bilan categoriya mavjud iltimos boshqa nom tanglang",
        ru: "Категория с таким названием уже существует, пожалуйста, выберите другое название.",
        en: "A category with this name already exists, please choose another name.",
      };

      const message = messages[lang];
      throw BaseError.Conflict(message, lang);
    }

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
      throw BaseError.NotFound("Category", lang);
    }

    return category;
  }
  async updateCategory(data, id, lang) {
    await this.getCategoryById(id, lang);
    if (data.name && data.name.en) {
      data.slug = data?.name?.en.toLowerCase().replace(/\s+/g, "-");
    }

    const category = await Category.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    return category;
  }

  async deleteCategory(id, lang) {
    await this.getCategoryById(id, lang);

    const deletedCategory = await Category.findByIdAndDelete(id);

    return {
      success: true,
      message: "This category successfully deleted",
      data: deletedCategory,
    };
  }
  async archivedCategory(id, lang) {
    const category = await Category.findById(id);

    if (!category) {
      throw BaseError.NotFound(_, lang);
    }

    const updateCategory = await Category.findByIdAndUpdate(id, {
      ...category,
      isActive: category.isActive ? false : true,
    });

    return {
      success: true,
      message: "This category successfully archived",
      data: updateCategory,
    };
  }

  // sub categories api
  async getSubCategoriesByCategory(id, activeOnly, lang) {
    const category = await Category.findOne({
      $or: [{ _id: id }, { slug: id }],
      isActive: true,
    });

    if (!category) {
      throw BaseError.NotFound(_, lang);
    }

    let subCategories = category.sub_categories;

    if (activeOnly === "true") {
      subCategories = subCategories.find((sub) => sub.isActive);
    }

    const transformSubCategories = subCategories.map((sub) => ({
      slug: sub.slug,
      name: sub.name[lang],
      isActive: sub.isActive,
    }));
    return {
      success: true,
      count: transformSubCategories.length,
      data: transformSubCategories,
    };
  }

  async addSubCategory(id, data, lang) {
    const category = await Category.findById(id);

    if (!category) {
      throw BaseError.NotFound(_, lang);
    }

    const existingSubCategory = category.sub_categories.find(
      (sub) => sub.slug === data.name.en.toLowerCase(),
    );

    if (existingSubCategory) {
      throw BaseError.Conflict(_, lang);
    }

    const slug = data.name.en.toLowerCase().replace(/\s+/g, "-");

    const newSubCategory = {
      name: data.name,
      slug,
      isActive: data.isActive,
    };
    category.sub_categories.push(newSubCategory);

    await category.save();
    return {
      success: true,
      data: newSubCategory,
    };
  }

  async updateSubCategory(id, data, lang) {
    const category = await Category.findById(id);

    if (!category) {
      throw BaseError.NotFound(_, lang);
    }

    let subCategory = category.sub_categories.find(
      (sub) => sub.slug === data.slug,
    );

    if (!subCategory) {
      throw BaseError.NotFound(_, lang);
    }

    const slug = data.name.en.toLowerCase().replace(/\s+/g, "-");

    subCategory.name = data.name;
    subCategory.slug = slug;
    subCategory.isActive = data.isActive;

    await category.save();

    return {
      success: true,
      data: subCategory,
    };
  }

  async archivedSubCategory(id, slug, lang) {
    const category = await Category.findById(id);

    if (!category) {
      throw BaseError.NotFound(_, lang);
    }

    const subCategory = category.sub_categories.find(
      (sub) => sub.slug === slug,
    );

    subCategory.isActive = subCategory.isActive ? false : true;

    await category.save();

    return {
      success: true,
    };
  }

  async deleteSubCategory(id, slug, lang) {
    const category = await Category.findById(id);

    if (category.length === 0) {
      throw BaseError.BadRequest(_, lang);
    }

    const subCategories = category.sub_categories.filter(
      (sub) => sub.slug !== slug,
    );

    await category.save();

    return {
      success: true,
      data: subCategories,
    };
  }
}

module.exports = new CategoryService();

const mongoose = require("mongoose");
const { generateUniqueSlug } = require("../utils/slugify");
const BaseError = require("../errors/base.error");

// model
const Shop = mongoose.model("Shop");

// service class
class ShopService {
  async getAllShops(options, lang) {
    const {
      page = 1,
      limit = 10,
      status,
      isFeatured,
      isVerified,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const filter = {};

    if (status) filter.status = status;
    if (isVerified !== undefined) filter.isVerified = isVerified;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured; // Typo: isFeatuer -> isFeatured
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { "name.uz": { $regex: search, $options: "i" } },
        { "name.ru": { $regex: search, $options: "i" } },
        { "name.en": { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // TO'G'RI: MongoDB chain syntax
    const shops = await Shop.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category", "name slug")
      .populate("owner");

    const totalShops = await Shop.countDocuments(filter);

    const messages = {
      uz: "Ma'lumotlar yuklandi",
      ru: "Данные загружены",
      en: "Data loaded",
    };

    return {
      success: true,
      message: messages[lang],
      data: shops.map((shop) => shop.toJSON({ lang })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalShops,
        pages: Math.ceil(totalShops / parseInt(limit)),
      },
    };
  }
  async create(data, ownerId, lang) {
    const existingShop = await Shop.findOne({
      owner: ownerId,
      "name.en": data.name.en,
    });

    if (existingShop) {
      const messages = {
        uz: "Shu nom bilan do'kon mavjud iltimos boshqa nom tanglang",
        ru: "Магазин с таким названием уже существует, пожалуйста, выберите другое название.",
        en: "A store with this name already exists, please choose a different name.",
      };
      throw BaseError.Conflict(messages, lang);
    }
    const slug = await generateUniqueSlug(Shop, data.name.en);
    const newShop = new Shop({
      ...data,
      slug,
      owner: ownerId,
      status: "pending",
      isVerified: false,
      isFeatured: true,
    });

    const savedShop = await newShop.save();

    const messages = {
      uz: "Doʻkon muvaffaqiyatli yaratildi",
      en: "Store successfully created",
      ru: "Магазин успешно создан",
    };
    return {
      success: true,
      message: messages[lang],
      data: savedShop,
    };
  }

  async getMyShops(query, lang, ownerId) {
    const {
      page = 1,
      limit = 10,
      status,
      isFeatured,
      isVerified,
      category,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = query;

    const filter = { owner: ownerId };

    if (status) filter.status = status;
    if (isVerified !== undefined) filter.isVerified = isVerified;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured; // Typo: isFeatuer -> isFeatured
    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { "name.uz": { $regex: search, $options: "i" } },
        { "name.ru": { $regex: search, $options: "i" } },
        { "name.en": { $regex: search, $options: "i" } },
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // TO'G'RI: MongoDB chain syntax
    const shops = await Shop.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("category", "name slug")
      .populate("owner");

    const totalShops = await Shop.countDocuments(filter);

    const messages = {
      uz: "Ma'lumotlar yuklandi",
      ru: "Данные загружены",
      en: "Data loaded",
    };

    return {
      success: true,
      message: messages[lang],
      data: shops.map((shop) => shop.toJSON({ lang })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalShops,
        pages: Math.ceil(totalShops / parseInt(limit)),
      },
    };
  }

  async getShopBySlug(slug, lang) {
    const existingShop = await Shop.findOne({ slug });
    if (!existingShop) {
      throw BaseError.NotFound("Shop", lang);
    }
    return {
      success: true,
      data: existingShop,
    };
  }

  async updateShop(shopId, data, lang, user) {
    const shop = await Shop.findById(shopId);

    if (!shop) {
      throw BaseError.NotFound("Shop", lang);
    }

    if (shop.owner.toString() !== user.id) {
      throw BaseError.Forbidden(lang);
    }

    const newSlug = await generateUniqueSlug(Shop, data?.name.en);

    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { $set: { ...data, slug: newSlug } }, // update qismi - bu yerda $or ISHLATILMAYDI!
      {
        new: true,
        runValidators: true,
      },
    )
      .populate("category", "name slug")
      .populate("owner", "firstName lastName email phone");

    // 7. Muvaffaqiyatli javob
    const messages = {
      uz: "Do'kon muvaffaqiyatli yangilandi",
      ru: "Магазин успешно обновлен",
      en: "Shop updated successfully",
    };

    return {
      success: true,
      message: messages[lang],
      data: updatedShop,
    };
  }

  async deleteShop(id, userId, lang) {
    if (!id) {
      throw BaseError.BadRequest(_, lang);
    }
    const shop = await Shop.findById(id);

    if (!shop) {
      throw BaseError.NotFound("Shop", lang);
    }
    if (String(shop.owner) !== userId) {
      throw BaseError.Forbiden(lang);
    }
    await shop.deleteOne();
    const messages = {
      uz: "Do'kon muvaffaqiyatli o'chirildi",
      ru: "Магазин успешно удалён.",
      en: "The store was successfully deleted.",
    };
    return {
      success: true,
      message: messages[lang],
    };
  }

  async changeStatus(slug, data, lang) {
    const shop = await Shop.findOne({ slug });

    if (!shop) {
      throw BaseError.NotFound("Shop", lang);
    }

    switch (data.status) {
      case "active":
        await shop.activate();
        break;
      case "suspend":
        await shop.suspend();
        break;
      case "close":
        await shop.close();
        break;
      default:
        shop.status = data.status;
        await shop.save()
    }
    const messages = {
      active: {
        uz: "Do'kon faollashtirildi",
        ru: "Магазин активирован",
        en: "Store activated",
      },
      close: {
        uz: "Do'kon yopildi",
        en: "The store is closed",
        ru: "Магазин закрыт",
      },
      suspend: {
        uz: "Do'kon faoliyati to'xtatildi",
        en: "The store was suspend",
        ru: "Работа магазина была приостановлена.",
      },
    };

    return {
      success: true,
      message: messages[data.status][lang]
    }
  }
}

module.exports = new ShopService();

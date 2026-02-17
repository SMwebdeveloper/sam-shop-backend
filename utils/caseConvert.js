// utils/caseConvert.js

/**
 * Kebab-case yoki path ni camelCase ga o'tkazadi
 * @param {string} str - Konvert qilinadigan string (masalan: "/updateCategory/:id" yoki "update-category")
 * @returns {string} camelCase format (masalan: "updateCategory")
 */
const kebabToCamel = (str) => {
  if (!str) return "";

  console.log("Original str:", str); // Debug uchun

  // 1. Path dan parametrlarni (:id, :slug) olib tashlash
  let cleanStr = str;

  // Agar string bo'lsa
  if (typeof str === "string") {
    // :id, :slug, :userId kabi parametrlarni olib tashlash
    cleanStr = str.replace(/\/:[^/]+/g, ""); // /:id, /:slug larni olib tashlaydi

    // Agar path bo'lsa (slash bilan boshlansa)
    if (cleanStr.startsWith("/")) {
      // Slashlarni olib tashlash va birinchi segmentni olish
      const segments = cleanStr
        .split("/")
        .filter((segment) => segment.trim() !== "");
      cleanStr = segments[0] || "";
    }
  }

  console.log("After path cleaning:", cleanStr); // Debug uchun

  // 2. Kebab-case ni camelCase ga o'tkazish
  // Masalan: "update-category" -> "updateCategory"
  const camelCased = cleanStr
    .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase())
    .replace(/[-_]/g, ""); // Qolgan tirelarni olib tashlash


  return camelCased;
};

module.exports = kebabToCamel;

const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class FileService {
  save(file) {
    try {
      // Fayl kengaytmasini olish
      const fileExtension = path.extname(file.name);
      const validExtensions = [".jpg", ".jpeg", ".png", ".gif"]; // Qo'llab-quvvatlanadigan kengaytmalar

      // Agar kengaytma valid bo'lmasa, xato tashlaymiz
      if (!validExtensions.includes(fileExtension.toLowerCase())) {
        throw new Error(
          `Invalid file type: ${fileExtension}. Only ${validExtensions.join(
            ", "
          )} are allowed.`
        );
      }

      const fileName = uuidv4() + fileExtension; // Dinamik kengaytma
      const currentDir = __dirname;
      const staticDir = path.join(currentDir, "..", "static");
      const filePath = path.join(staticDir, fileName);

      // Statik papka mavjudligini tekshirish va yaratish
      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }

      // Faylni saqlash
      file.mv(filePath);
      return { image: `http://localhost:${process.env.PORT}/${fileName}` };
    } catch (error) {
      throw new Error(`Error saving file: ${error}`);
    }
  }
}

module.exports = new FileService()

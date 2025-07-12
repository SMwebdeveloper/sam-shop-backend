const fileService = require("../service/file.service");
class FileController {
  addFile(req, res, next) {
    try {
      const picture = req.files.image;
      const resultPicture = fileService.save(picture);
      res.status(206).json(resultPicture);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new FileController();

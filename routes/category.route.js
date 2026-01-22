const express = require("express");
const categoryController = require("../controllers/category.controller");
const validationMiddleware = require("../middlewares/validate.middleware");
const validationResult = require("../middlewares/runValidation.middleware");
const router = express.Router();

router.get("/all", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.post(
  "/create",
  validationMiddleware("category"),
  validationResult(),
  categoryController.createCategory,
);
router.put(
  "/update-category",
  validationMiddleware("category"),
  validationResult(),
  categoryController.updateCategory,
);
module.exports = router;

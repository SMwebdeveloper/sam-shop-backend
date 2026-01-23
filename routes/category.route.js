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
  "/update-category/:id",
  validationMiddleware("category"),
  validationResult(),
  categoryController.updateCategory,
);
router.delete("/archived/:id", categoryController.archivedCategory);
router.delete("/delete/:id", categoryController.deleteCategory);
module.exports = router;

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

router.get("/sub-category/:id", categoryController.getSubCategoryByCategory);
router.post(
  "/sub-category/create/:categoryId",
  validationMiddleware("category"),
  validationResult(),
  categoryController.addSubCategory,
);
router.put(
  "/sub-category/update/:categoryId",
  categoryController.updateSubCategory,
);
router.put(
  "/sub-category/archived/:categoryId/:slug",
  categoryController.archivedSubCategory,
);
router.delete(
  "/sub-category/delete/:categoryId/:slug",
  categoryController.deletedSubCategory,
);
module.exports = router;

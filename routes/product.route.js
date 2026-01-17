const express = require("express");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorMiddleware = require("../middlewares/author.middleware");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getById);
router.post("/add", authMiddleware, productController.create);
router.put(
  "/update/:id",
  authMiddleware,
  authorMiddleware,
  productController.update
);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorMiddleware,
  productController.delete
);
router.post("/:id/ratings", authMiddleware, productController.addProductRating);

module.exports = router;

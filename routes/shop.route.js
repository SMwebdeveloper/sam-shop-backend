const express = require("express");
const shopController = require("../controllers/shop.controller")
const authMiddleware = require("../middlewares/auth.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const validationResult = require("../middlewares/runValidation.middleware");

const router = express.Router();
router.get("/all", shopController.getAllShops);
router.get("/by-owner", authMiddleware, shopController.getShopByOnwer);
router.get("/:slug", shopController.getShopBySlug)
router.post(
  "/create",
  authMiddleware,
  validateMiddleware("shop"),
  validationResult(),
  shopController.createShop,
);

router.put(
  "/update/:id",
  authMiddleware,
  validateMiddleware("shop"),
  validationResult(),
  shopController.updateShop,
);

router.delete("/delete/:id", authMiddleware, shopController.deleteShop)
module.exports = router;

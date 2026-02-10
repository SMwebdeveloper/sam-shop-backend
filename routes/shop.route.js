const express = require("express");
const shopController = require("../controllers/shop.controller");
const validateMiddleware = require("../middlewares/validate.middleware");
const validationResult = require("../middlewares/runValidation.middleware");

const router = express.Router();
router.post(
  "/create",
  validateMiddleware("shop"),
  validationResult(),
  shopController.createShop,
);
module.exports = router;

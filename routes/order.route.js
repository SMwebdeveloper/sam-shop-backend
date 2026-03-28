const express = require("express");
const orderController = require("../controllers/order.controller");
const paramsMiddleware = require("../middlewares/params.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const validateRequest = require("../middlewares/runValidation.middleware");
const validateMiddleware = require("../middlewares/validate.middleware");
const { validationResult } = require("express-validator");

const router = express.Router();

const moduleName = "order";

// get
router.get("/all", authMiddleware, orderController.getOrders);
router.get("/my-orders", authMiddleware, orderController.getUserOrders);
router.get("/seller-orders", authMiddleware, orderController.getSellerOrders);
router.get(
  "/:id",
  authMiddleware,
  paramsMiddleware,
  orderController.getOrderById,
);
router.get(
  "/:shopId",
  authMiddleware,
  paramsMiddleware,
  orderController.getOrdersByShop,
);
router.get(
  "/:productId",
  authMiddleware,
  paramsMiddleware,
  orderController.getOrdersByProduct,
);
router.get(
  "/:shopId/:orderId",
  authMiddleware,
  paramsMiddleware,
  orderController.getOrderByShop,
);
router.get(
  "/:productId/:orderId",
  authMiddleware,
  paramsMiddleware,
  orderController.getOrderByProduct,
);

// post
router.post(
  "/create",
  authMiddleware,
  validateMiddleware(moduleName),
  validationResult,
  orderController.create,
);

//put
router.put(
  "/pay/:orderId",
  authMiddleware,
  paramsMiddleware,
  validateMiddleware(moduleName),
  validationResult,
  orderController.updateOrderToPaid,
);
router.put(
  "/delivered/:orderId",
  authMiddleware,
  orderController.updateOrderToDelivered,
);

router.put(
  "/cancel/:orderId",
  authMiddleware,
  paramsMiddleware,
  orderController.cancelOrder,
);

// patch
router.patch(
  "/status/:orderId",
  authMiddleware,
  paramsMiddleware,
  validateMiddleware(moduleName),
  validationResult,
  orderController.updateOrderStatus,
);
router.patch(
  "/return/:orderId,",
  authMiddleware,
  validateMiddleware(moduleName),
  validateRequest(),
  orderController.requestReturn,
);
router.patch(
  "/return-status/:returnId",
  authMiddleware,
  paramsMiddleware,
  validateMiddleware(moduleName),
  validationResult,
  orderController.updateReturnStatus,
);

module.exports = router;

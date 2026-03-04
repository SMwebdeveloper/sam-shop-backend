const express = require("express");
const authController = require("../controllers/auth.controller");
const validationResult = require("../middlewares/runValidation.middleware");
const validationMiddleware = require("../middlewares/validate.middleware");
const router = express.Router();
const moduleName = "auth";
router.post(
  "/register",
  validationMiddleware(moduleName),
  validationResult(),
  authController.register,
);
router.post(
  "/verify",
  validationMiddleware(moduleName),
  validationResult(),
  authController.verifyEmail,
);
router.post(
  "/login",
  validationMiddleware(moduleName),
  validationResult(),
  authController.login,
);
router.post("/logout", authController.logout);
router.post(
  "/reset-password",
  validationMiddleware(moduleName),
  validationResult(),
  authController.resetPassword,
);
router.put(
  "/recovery-account",
  validationMiddleware(moduleName),
  validationResult(),
  authController.recoveryAccount,
);
router.get("/refresh", authController.refresh);
module.exports = router;

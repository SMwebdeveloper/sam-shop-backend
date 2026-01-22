const express = require("express");
const authController = require("../controllers/auth.controller");
const validationResult = require("../middlewares/runValidation.middleware");
const validationMiddleware = require("../middlewares/validate.middleware");
const router = express.Router();

router.post(
  "/register",
  validationMiddleware("auth"),
  validationResult(),
  authController.register
);
router.post(
  "/verify",
   validationMiddleware("auth"),
   validationResult(),
  authController.verifyEmail
);
router.post(
  "/login",
  validationMiddleware("auth"),
  validationResult(),
  authController.login
);
router.post("/logout", authController.logout);
router.post(
  "/reset-password",
  validationMiddleware("auth"),
  validationResult(),
  authController.resetPassword
);
router.put(
  "/recovery-account",
  validationMiddleware("auth"),
  validationResult(),
  authController.recoveryAccount
);
router.get("/refresh", authController.refresh);
module.exports = router;

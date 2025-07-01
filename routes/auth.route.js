const express = require("express");
const authController = require("../controllers/auth.controller");
const { body } = require("express-validator");
const router = express.Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("username")
    .notEmpty()
    .withMessage("Please enter username")
    .isLength({ min: 3, max: 10 }),
  body("password").isLength({ min: 6, max: 10 }),
  authController.register
);
router.post("/verify", authController.verifyEmail)
router.post("/login", authController.login)
router.post("/logout", authController.logout)
router.post("/reset-password", authController.resetPassword);
router.post("/recovery-account", authController.recoveryAccount)
module.exports = router;

const authService = require("../service/auth.service");
const mailService = require("../service/mail.service");
const userModel = require("../models/user.model");
const tokenService = require("../service/token.service");
class AuthControl {
  async register(req, res, next) {
    try {
      const localeHeader = req.header("accept-language") || "uz";

      const user = await authService.register(req.body, localeHeader);
      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async verifyEmail(req, res, next) {
    try {
      const errors = validationResult(req);
      const { email, otp } = req.body;

      if (!errors.isEmpty()) {
        return;
      }
      const response = await mailService.verifyOtp(email, otp);
      if (response) {
        const user = await userModel.findOneAndUpdate(
          { email },
          { isVerifiyed: true }
        );
        res.status(200).json({ user });
      }
    } catch (error) {
      next(error);
    }
  }
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);
      res.cookie("refreshToken", user.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await tokenService.removeToken(refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(req, res, next) {
    try {
      const { email } = req.body;
      await authService.resetPassword(email);
      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }

  async recoveryAccount(req, res, next) {
    try {
      const { token, password } = req.body;
      await authService.recoveryAccount(token, password);
      return res.json({ success: true });
    } catch (error) {
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const data = await authService.refresh(refreshToken);
      res.cookie("refreshToken", data.refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthControl();

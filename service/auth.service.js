const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const BaseError = require("../errors/base.error");
const UserDto = require("../dtos/user.dto");
const mailService = require("./mail.service");
const tokenService = require("./token.service");

// model
const userModel = mongoose.model("User");

// auth service
class AuthService {
  async register(userData, locale) {
    const { username, email, password, role } = userData;
    const isExistUser = await userModel.findOne({ email });
    if (isExistUser) {
      const messages = {
        uz: "Bu email manzili allaqachon ro'yxatdan o'tgan. Iltimos, boshqa email kiriting yoki tizimga kiring.",
        ru: "Этот адрес электронной почты уже зарегистрирован. Пожалуйста, введите другой email или войдите в систему.",
        en: "This email address is already registered. Please enter a different email or log in.",
      };
      const errorMessage = messages[locale];
      throw BaseError.Conflict(errorMessage, locale);
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      email,
      password: hashPassword,
      role,
    });
    const userDto = new UserDto(user);
    await mailService.sendOtp(userDto.email);

    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.save(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }
  async login(email, password, locale) {
    const user = await userModel.findOne({ email });
    if (!user) {
      const errorMessage = {
        uz: "Foydalanuvchi topilmadi",
        ru: "Пользователь не найден",
        en: "User not found",
      };

      throw BaseError.NotFound(errorMessage[locale], locale);
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      const errorMessage = {
        uz: "Parol noto'g'ri",
        ru: "Неверный пароль",
        en: "Incorrect password",
      };
      throw BaseError.UnAuthorizedError(errorMessage[locale], locale);
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.save(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }

  async logout(refreshToken) {
    await tokenService.removeToken(refreshToken);
  }

  async resetPassword(email) {
    if (!email) {
      return BaseError.BadRequest("Email is required");
    }
    const user = await userModel.findOne({ email });

    if (!user) {
      return BaseError.BadRequest("User with is existing email is not found");
    }

    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });
    await mailService.sendForgotPassword(
      email,
      `http://localhost:5173/recovery-account/${tokens.accessToken}`,
    );
    return 200;
  }
  async recoveryAccount(token, password) {
    if (!token) {
      return BaseError.BadRequest("Something went wrong with token");
    }
    const userData = await tokenService.validateAccessToken(token);

    if (!userData) {
      return BaseError.BadRequest("Expired access to your account");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await userModel.findByIdAndUpdate(userData.id, { password: hashPassword });
    return 200;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      return BaseError.UnAuthorizedError("Bad authorization");
    }

    const userPayload = tokenService.validateRefreshToken(refreshToken);
    const tokenDB = await tokenService.findToken(refreshToken);

    if (!userPayload || !tokenDB) {
      return BaseError.UnAuthorizedError("Bad authorization");
    }

    const user = await userModel.findById(userPayload.id);
    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.save(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }
}

module.exports = new AuthService();

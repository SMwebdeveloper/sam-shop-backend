const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const BaseError = require("../errors/base.error");
const UserDto = require("../dtos/user.dto");
const mailService = require("./mail.service");
const tokenService = require("./token.service");
class AuthService {
  async register(userData) {
    const { username, email, password, role } = userData;
    const isExistUser = await userModel.findOne({ email });
    if (isExistUser) {
      throw BaseError.BadRequest(
        `User is existing email ${email} already registered`
      );
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
  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw BaseError.BadRequest("User not found");
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw BaseError.BadRequest("Password is Wrong");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.save(userDto.id, tokens.refreshToken);
    return { user: userDto, ...tokens };
  }

  async logout(refreshToken) {
    await tokenService.removeToken(refreshToken);
  }
}

module.exports = new AuthService();

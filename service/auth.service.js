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
      `http://localhost:5173/recovery-account/${tokens.accessToken}`
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
    if(!refreshToken) {
      return BaseError.UnAuthorizedError("Bad authorization")
    }

    const userPayload = tokenService.validateRefreshToken(refreshToken)
    const tokenDB = await tokenService.findToken(refreshToken)

    if(!userPayload || !tokenDB) {
      return BaseError.UnAuthorizedError("Bad authorization")
    }

    const user = await userModel.findById(userPayload.id)
    const userDto = new UserDto(user)

    const tokens = tokenService.generateToken({...userDto})

    await tokenService.save(userDto.id, tokens.refreshToken)

    return {user: userDto, ...tokens}
  }
}

module.exports = new AuthService();

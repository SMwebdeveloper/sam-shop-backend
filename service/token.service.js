const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token.model");

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: "30d",
    });
    return { accessToken, refreshToken };
  }
  async save(userId, refreshToken) {
    const existUser = await tokenModel.findOne({ user: userId });

    if (existUser) {
      existUser.refreshToken = refreshToken;
      return existUser.save();
    }
    const token = await tokenModel.create({ user: userId, refreshToken });
    return token;
  }
  async removeToken(refreshToken) {
    return await tokenModel.findOneAndDelete(refreshToken);
  }
  async findToken(refreshToken) {
    return await tokenModel.findOne({ refreshToken });
  }
}

module.exports = new TokenService();

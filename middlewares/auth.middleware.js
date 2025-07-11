const BaseError = require("../errors/base.error");
const tokenService = require("../service/token.service");

module.exports = function (req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return next(BaseError.UnAuthorizedError());
    }

    const accessToken = authorization.split(" ")[1];

    if (!accessToken) {
      return next(BaseError.UnAuthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(BaseError.UnAuthorizedError());
    }

    req.user = userData;
    next();
  } catch (error) {
    return next(BaseError.UnAuthorizedError());
  }
};

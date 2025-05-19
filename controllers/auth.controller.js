const authService = require('../service/auth.service')
class AuthControl {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body)
      return res.status(200).json(user)
    } catch (error) {
      console.log(error);
      next()
    }
  }
}

module.exports = new AuthControl();

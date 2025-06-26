const BaseError = require('../errors/base.error')
const authService = require('../service/auth.service')
const {validationResult} = require("express-validator")
const mailService = require('../service/mail.service')
const userModel = require('../models/user.model')
class AuthControl {
  async register(req, res, next) {
    try {
      const errors = validationResult(req)

      if(!errors.isEmpty()) {
        return next(
          BaseError.BadRequest("Error with validation", errors.array())
        )
      }
      const user = await authService.register(req.body)
      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
  async verifyEmail(req, res, next) {
    try {
      const {email, otp} = req.body
      const response = await mailService.verifyOtp(email, otp)
      if(response) {
        const user = await userModel.findOneAndUpdate({email}, {isVerifiyed: true})
        res.status(200).json({user})
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthControl();

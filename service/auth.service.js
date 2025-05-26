const bcrypt = require('bcryptjs')
const userModel = require("../models/user.model")
const BaseError = require("../errors/base.error")
const UserDto = require("../dtos/user.dto")

class AuthService {
    async register(userData) {
        const {username, email, password, role} = userData
        const isExistUser = await userModel.findOne({email})
        if(isExistUser) {
            throw BaseError.BadRequest(`User is existing email ${email} already registered`)
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = await userModel.create({username, email, password: hashPassword, role})
        const userDto = new UserDto(user)
        return {userDto}
    }
}

module.exports = new AuthService()
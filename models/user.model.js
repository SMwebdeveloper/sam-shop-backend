const {Schema, model} = require("mongoose")

const UserSchema = new Schema({
    username: {type: String, required: true,},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String,},
    isVerfiyed: {type: Boolean}
}, {timestamps: true})

module.exports = model("User", UserSchema)
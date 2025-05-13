const {Schema, model} = require("mongoose")

const UserSchema = new Schema({
    username: {type: String, required: true,},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String,}
}, {timestamps: true})

module.exports = model("User", UserSchema)
module.exports = class UserDto {
    username
    email
    id
    role

    constructor(model) {
        this.id = model._id
        this.username = model.username
        this.email = model.email
        this.role = model.role
    }
}
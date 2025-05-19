module.exports = class UserDto {
    username
    email
    id
    role

    constructor(model) {
        this.username = model.username
        this.email = model.email
        this.id = model._id
        this.role = model.role
    }
}
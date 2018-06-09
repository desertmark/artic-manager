const userService = require('../../users/user-service');
const roleEnum = require('../../users/roles-enum');

function seedAdmin() {
    return userService.factoryUser({
        email:'admin',
        password:'admin',
        firstName:'Admin',
        lastName:'istrator',
        role: roleEnum.ADMIN
    })
    .then(admin => userService.createOrUpdate(admin));
}

module.exports = {
    seedAdmin
}
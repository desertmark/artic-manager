const userService = require('../../users/user-service');

function seedAdmin() {
    return userService.factoryUser({
        email:'admin',
        password:'admin',
        firstName:'Admin',
        lastName:'istrator',
    })
    .then(admin => userService.createOrUpdate(admin));
}

module.exports = {
    seedAdmin
}
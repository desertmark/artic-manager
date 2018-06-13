const container = require('../../config/awilix').getContainer();
const roleEnum = require('../../users/roles-enum');

function seedAdmin() {
    const userService = container.resolve('userRepositoryTransient');
    return userService.factoryUser({
        email:'admin',
        password:'admin',
        firstName:'Admin',
        lastName:'istrator',
        role: roleEnum.ADMIN
    })
    .then(admin => userService.createOrUpdate(admin));
    container.dispose();
}

module.exports = {
    seedAdmin
}
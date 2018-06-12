const awilix = require('awilix');
const UserRepository = require('../users/user-repository');
const UserController = require('../users/user-controller');

function getContainer() {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.PROXY
    });

    container.register({
        userRepository: awilix.asClass(UserRepository).scoped()
    });
    container.register({
        userController: awilix.asClass(UserController).scoped()
    })
    return container;
}

function scopeContainer(container) {
    return (req, res, next) => {
        req.container = container.createScope();
        next();
    }
}

module.exports = {
    getContainer,
    scopeContainer
}
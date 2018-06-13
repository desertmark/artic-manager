const awilix = require('awilix');
const UserRepository = require('../users/user-repository');
const UserController = require('../users/user-controller');
const AuthService = require('../auth/auth-service');
const AuthController = require('../auth/auth-controller');

function getContainer() {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.PROXY
    });

    container.register({
        userRepositoryTransient: awilix.asClass(UserRepository).transient(), // To prevent seeding request for user repo keeps the same instance for each request. That provokes currentUser to be null.
        userRepository: awilix.asClass(UserRepository).scoped(),
        userController: awilix.asClass(UserController).scoped(),
        authService: awilix.asClass(AuthService).scoped(),
        authController: awilix.asClass(AuthController).scoped(),
        currentUser: awilix.asValue(null)
    });
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
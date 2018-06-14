const awilix = require('awilix');

const User = require('../users/users');
const UserRepository = require('../users/user-repository');
const UserController = require('../users/user-controller');

const AuthService = require('../auth/auth-service');
const AuthController = require('../auth/auth-controller');

const Article = require('../articles/articles');
const ArticleRepository = require('../articles/articles-Repository');
const ArticleController = require('../articles/articles-controller');

const Category = require('../categories/categories');
const CategoriesRepository = require('../categories/categories-repository');
const CategoriesController = require('../categories/categories-controller');

function getContainer() {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.PROXY
    });

    container.register({
        User: awilix.asValue(User),
        userRepositoryTransient: awilix.asClass(UserRepository).transient(), // To prevent seeding request for user repo keeps the same instance for each request. That provokes currentUser to be null.
        userRepository: awilix.asClass(UserRepository).scoped(),
        userController: awilix.asClass(UserController).scoped(),
        authService: awilix.asClass(AuthService).scoped(),
        authController: awilix.asClass(AuthController).scoped(),
        currentUser: awilix.asValue(null),
        Article: awilix.asValue(Article),
        articleRepository: awilix.asClass(ArticleRepository).scoped(),
        articleController: awilix.asClass(ArticleController).scoped(),

        Category: awilix.asValue(Category),
        categoriesRepository: awilix.asClass(CategoriesRepository).scoped(),
        categoriesController: awilix.asClass(CategoriesController).scoped(),
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
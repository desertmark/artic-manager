const path                  = require('path');
const using = (filePath) => require(path.join(__dirname, filePath));
const awilix                = require('awilix');

const User                  = using('../users/users');
const UserRepository        = using('../users/user-repository');
const UserController        = using('../users/user-controller');

const AuthService           = using('../auth/auth-service');
const AuthController        = using('../auth/auth-controller');

const Article               = using('../articles/articles');
const ArticleRepository     = using('../articles/articles-Repository');
const ArticleService        = using('../articles/articles-service');
const ArticleController     = using('../articles/articles-controller');


const Category              = using('../categories/categories');
const CategoriesRepository  = using('../categories/categories-repository');
const CategoriesController  = using('../categories/categories-controller');

function getContainer() {
    const container = awilix.createContainer({
        injectionMode: awilix.InjectionMode.PROXY
    });

    container.register({
        User:                   awilix.asValue(User),
        userRepositoryTransient:awilix.asClass(UserRepository).transient(), // To prevent seeding request for user repo keeps the same instance for each request. That provokes currentUser to be null.
        userRepository:         awilix.asClass(UserRepository).scoped(),
        userController:         awilix.asClass(UserController).scoped(),
        
        authService:            awilix.asClass(AuthService).scoped(),
        authController:         awilix.asClass(AuthController).scoped(),
        
        currentUser:            awilix.asValue(null),
        
        Article:                awilix.asValue(Article),
        articleRepository:      awilix.asClass(ArticleRepository).scoped(),
        articleController:      awilix.asClass(ArticleController).scoped(),
        articleService:         awilix.asClass(ArticleService).scoped(),

        Category:               awilix.asValue(Category),
        categoriesRepository:   awilix.asClass(CategoriesRepository).scoped(),
        categoriesController:   awilix.asClass(CategoriesController).scoped(),
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
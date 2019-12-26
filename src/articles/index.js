const middlewares = require('./articles-middlewares');
const awilixExpress = require('awilix-express');
const ArticlesController = require('./articles-controller');
const passport = require('passport');
const { ANONYMOUS, ADMIN, USER } = require('../users/roles-enum');

const ctrlBuilder = awilixExpress
.createController(ArticlesController)
.prefix('/articles')
.get('/status', 'status', {before: passport.authenticateJwt(ADMIN)})
.get('/', 'get',{before: [passport.authenticateJwt(ANONYMOUS),middlewares.parseFieldsToArray, middlewares.parseFilterToObject]})
.get('/:id', 'getById', {before: passport.authenticateJwt([USER, ADMIN])})
.post('/', 'post', {before: passport.authenticateJwt(ADMIN)})
.post('/search', 'postSearch',{before: [passport.authenticateJwt(ANONYMOUS), middlewares.parseFieldsToObject]})
.patch('/','patch', {before: passport.authenticateJwt(ADMIN)})
.patch('/:id', 'patchById', {before: passport.authenticateJwt(ADMIN)})
.delete('/:id', 'delete', {before: passport.authenticateJwt(ADMIN)});

const router = awilixExpress.controller(ctrlBuilder);
router.param('id', passport.authenticateJwt(ANONYMOUS));
router.param('id', middlewares.findById);

module.exports = router;

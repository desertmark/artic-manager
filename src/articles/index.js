const middlewares = require('./articles-middlewares');
const awilix = require('awilix');
const awilixExpress = require('awilix-express');
const ArticlesController = require('./articles-controller');
const passport = require('passport');
const roleEnum = require('../users/roles-enum');

const ctrlBuilder = awilixExpress
.createController(ArticlesController)
.prefix('/articles')
.get('/', 'get',{before: [passport.authenticateJwt(roleEnum.ANONYMOUS),middlewares.parseFieldsToArray]})
.get('/:id', 'getById')
.post('/', 'post')
.post('/search', 'postSearch',{before: middlewares.parseFields})
.put('/','putByCodeRange')
.put('/:id', 'put')
.delete('/:id', 'delete');

const router = awilixExpress.controller(ctrlBuilder);
router.param('id', passport.authenticateJwt(roleEnum.ANONYMOUS));
router.param('id', middlewares.findById);

module.exports = router;

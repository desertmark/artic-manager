const middlewares = require('./user-middlewares');
const passport = require('passport');
const awilixExpress = require('awilix-express');
const UserController = require('./user-controller');
const roleEnum = require('./roles-enum');

const ctrlBuilder = awilixExpress
.createController(UserController)
.prefix('/users')
.before(passport.authenticateJwt(roleEnum.ADMIN))
.get('/','getAll')
.get('/:id','get')
.put('/:id','put')
.post('/','post', {before: middlewares.isAdmin});

module.exports = ctrlBuilder;
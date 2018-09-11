const middlewares = require('./user-middlewares');
const passport = require('passport');
const awilixExpress = require('awilix-express');
const UserController = require('./user-controller');
const roleEnum = require('./roles-enum');

const ctrlBuilder = awilixExpress
.createController(UserController)
.prefix('/users')
.before(passport.authenticateJwt([roleEnum.USER, roleEnum.ADMIN]))
.get('/','getAll', {before: middlewares.isAdmin})
.get('/:id','get', {before: middlewares.isHimselfOrAdmin})
.put('/:id','put', {before: [middlewares.isHimselfOrAdmin, middlewares.isRoleEditing]})
.post('/','post', {before: middlewares.isAdmin})
.delete('/:id','delete', {before: middlewares.isAdmin});

module.exports = ctrlBuilder;
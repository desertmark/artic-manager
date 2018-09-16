const passport = require('passport');
const awilixExpress = require('awilix-express');
const AuthController = require('./auth-controller');

const ctrlBuilder = awilixExpress
.createController(AuthController)
.prefix('/auth')
.post('/login','login')
.get('/logout','logout', { before: passport.authenticateJwt() })
.post('/passwordUpdate', 'passwordUpdate', { before: passport.authenticateJwt() })
.get('/isAuthenticated','isAuthenticated', { before: passport.authenticateJwt() });

module.exports = ctrlBuilder;
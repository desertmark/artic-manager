const router = require('express').Router();
const userService = require('../users/user-service');
const middlewares = require('./middlewares');
const passport = require('passport');
const awilixExpress = require('awilix-express');
const UserController = require('./user-controller');

const ctrlBuilder = awilixExpress
.createController(UserController)
.prefix('/users')
.before(passport.authenticateJwt())
.get('/','getAll')
.get('/:id','get')
.post('./','post', {before: middlewares.isAdmin});

module.exports = ctrlBuilder;
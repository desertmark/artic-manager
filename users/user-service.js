const User = require('./users');
const bcrypt = require('bcryptjs');
const authService = require('../auth/auth-service');
const _ = require('lodash');


function findById(id) {
    return User
    .findById(id)
    .catch(handleError);
}

function findByEmail(email) {
    return User
    .findOne({email})
    .catch(handleError);
}

function createUser(user) {
    return factoryUser(user).then(userToStore => {
        User.create(userToStore);
    });
}

function factoryUser(user) {
    if (!isValid(user)) {
        return Promise.reject({
            status: 400,
            message: 'Invalid User: User must have a email and a password.'
        });
    }
    return authService.hashPassword(user.password)
    .then(passwordHash => {
        user.passwordHash = passwordHash;
        return _.pick(user, ['email', 'passwordHash','firstName', 'lastName']);
    })
    .catch(handleError);
}

function updateUser(id, fields) {
    return User.findByIdAndUpdate(id,{$set:fields});
}

function createOrUpdate(user) {
    return User.findOneAndUpdate({email:user.email},{$set:user}, {upsert: true});
}

function isValid(user) {
    //TODO: add password validations.
    return user.email && user.password;
}

function handleError(err) {
    console.error(err);
    return err;
}

module.exports = {
    findById,
    findByEmail,
    createUser,
    factoryUser,
    createOrUpdate,
    updateUser
}
const User = require('./users');
const bcrypt = require('bcryptjs');
const authService = require('../auth/auth-service');


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
    if (!isValid(user)) {
        return Promise.reject({
            status: 400,
            message: 'Invalid User: User must have a email and a password.'
        });
    }
    return authService.hashPassword(user.password)
    .then(passwordHash => {
        user.passwordHash = passwordHash;
        return User.create(user);
    })
    .catch(handleError);
}

function updateUser(id, fields) {
    return User.findByIdAndUpdate(id,{$set:fields});
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
    updateUser
}
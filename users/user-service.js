const User = require('./users');
const bcrypt = require('bcryptjs');
const authService = require('../auth/auth-service');
const _ = require('lodash');
const roleEnum = require('./roles-enum');

/**
 * Query Users table and paginates results.
 * @param {Number} page Page number. Default is 0.
 * @param {Number} pageSize Page Size. Default is 20.
 * @param {Object} filter filter object to search by role or partial email, firstname, lastname.
 * @param {Object | String} fields fields for the query to return. If not passed returns all of them. Pass it like ``{fieldName:1}`` or ``"fieldName1 fieldName2"``.
 * @returns {DocumentQuery<Article>} DocumentQuery<User>. call ``then`` to get results.
 */
function listUsers(page, pageSize, filter = {}) {
    page = parseInt(page) || 0;
    size = parseInt(pageSize) || 20;

    // optional filters: matching codes and/or partial description match
    let queryFilter = {};
    if(filter.role) queryFilter.role = { $eq: filter.role };
    if(filter.email) queryFilter.email = { $regex: `.*${filter.email}.*` };
    if(filter.firstName) queryFilter.firstName = { $regex: `.*${filter.firstName}.*` };
    if(filter.lastName) queryFilter.lastName = { $regex: `.*${filter.lastName}.*` };

    const query = User
    .find(queryFilter)
    .sort('email')
    .skip(page*size)
    .limit(size)
    return query;
}

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
    return factoryUser(user).then(userToStore => User.create(userToStore));
}

function factoryUser(user) {
    if (!isValid(user)) {
        return Promise.reject({
            status: 400,
            message: 'Invalid User.'
        });
    }
    return authService.hashPassword(user.password)
    .then(passwordHash => {
        user.passwordHash = passwordHash;
        return _.pick(user, ['email', 'passwordHash','firstName', 'lastName', 'role']);
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
    return user.email && user.password && (user.role === roleEnum.ADMIN || user.role === roleEnum.USER);
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
    updateUser,
    listUsers
}
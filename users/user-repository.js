const bcrypt = require('bcryptjs');
const AuthService = require('../auth/auth-service');
const _ = require('lodash');
const roleEnum = require('./roles-enum');

class UserRepository {
    constructor(opts) {
        this.currentUser = opts.currentUser;
        this.User = opts.User;
    }
    /**
     * Query Users table and paginates results.
     * @param {Number} page Page number. Default is 0.
     * @param {Number} size Page Size. Default is 20.
     * @param {Object} filter filter object to search by role or partial email, firstname, lastname.
     * @param {Object | String} fields fields for the query to return. If not passed returns all of them. Pass it like ``{fieldName:1}`` or ``"fieldName1 fieldName2"``.
     * @returns {DocumentQuery<Article>} DocumentQuery<User>. call ``then`` to get results.
     */
    listUsers(page, size, filter = {}) {
        page = parseInt(page) || 0;
        size = parseInt(size) || 20;

        // optional filters: matching codes and/or partial description match
        let queryFilter = {};
        if(filter.role) queryFilter.role = { $eq: filter.role };
        if(filter.email) queryFilter.email = { $regex: `.*${filter.email}.*` };
        if(filter.firstName) queryFilter.firstName = { $regex: `.*${filter.firstName}.*` };
        if(filter.lastName) queryFilter.lastName = { $regex: `.*${filter.lastName}.*` };

        const query = this.User
        .find(queryFilter)
        .sort('email')
        .skip(page*size)
        .limit(size)
        return query;
    }

    findById(id) {
        return this.User
        .findById(id)
        .catch(handleError);
    }

    findByEmail(email) {
        return this.User
        .findOne({email})
        .catch(handleError);
    }

    createUser(user) {
        return factoryUser(user).then(userToStore => this.User.create(userToStore));
    }

    factoryUser(user) {
        if (!isValid(user)) {
            return Promise.reject({
                status: 400,
                message: 'Invalid User.'
            });
        }
        return AuthService.hashPassword(user.password)
        .then(passwordHash => {
            user.passwordHash = passwordHash;
            return _.pick(user, ['email', 'passwordHash','firstName', 'lastName', 'role']);
        })
        .catch(handleError);
    }

    updateUser(id, fields) {
        return this.User.findByIdAndUpdate(id,{$set:fields});
    }

    createOrUpdate(user) {
        return this.User.findOneAndUpdate({email:user.email},{$set:user}, {upsert: true});
    }

}


function isValid(user) {
    //TODO: add password validations.
    return user.email && user.password && (user.role === roleEnum.ADMIN || user.role === roleEnum.USER);
}

function handleError(err) {
    console.error(err);
    return err;
}

module.exports = UserRepository;
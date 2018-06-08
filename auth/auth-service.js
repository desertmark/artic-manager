const bcrypt = require('bcryptjs');
const config = require('../config/config.json');
const userService = require('../users/user-service');
const jwt = require('jsonwebtoken');

function comparePassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}

function hashPassword(password) {
    return bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(user.password, salt))
    .catch(handleError);
}

function handleError(err) {
    console.error(err);
    return err;
}

function generateToken(user) {
    const userService = require('../users/user-service');
    return generateNonce().then(nonce => {
        return userService.updateUser(user._id, {nonce}).then(u => {
            if(!u) {
                return Promise.reject({status:404, message: 'User not found.'});
            }
            return jwt.sign(user, config.secret + nonce, {expiresIn:3600});
        });
    });
}

function generateNonce() {
    return bcrypt.genSalt(10);
}

function getClaims(user) {
    const name = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined;
    return {
        sub: user._id,
        name,
        email: user.email
    };
}

function login(email, password) {
    const userService = require('../users/user-service');
    return userService.findByEmail(email).then(user => {
        if (!user) {
            return Promise.reject({
                status:404,
                message:'Invalid email address.'
            });
        }
        return comparePassword(password, user.passwordHash).then(isMatch => {
            if(!isMatch) {
                return Promise.reject({
                    status:401,
                    message:'Invalid password.'
                });
            }
            return generateToken(user.toObject()).then(token => {
                return {
                    token,
                    claims: getClaims(user.toObject())
                };
            })
        });
    })
}

function logout(token) {
    const userService = require('../users/user-service');
    const decodedToken = jwt.decode(token);
    const userId = decodedToken._id;
    return userService.updateUser(userId, {nonce: null});
}

module.exports = {
    comparePassword,
    hashPassword,
    generateToken,
    getClaims,
    login,
    logout
}
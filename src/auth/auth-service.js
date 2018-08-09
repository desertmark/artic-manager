const bcrypt = require('bcryptjs');
const config = require('../config/config.js');
const jwt = require('jsonwebtoken');

class AuthService {
    constructor(opts) {
        this.userRepository = opts.userRepository;

        // this.comparePassword = this.comparePassword.bind(this);
        // this.hashPassword = this.hashPassword.bind(this);
        // this.generateNonce = this.generateNonce.bind(this);
        // this.getClaims = this.getClaims.bind(this);
        this.generateToken = this.generateToken.bind(this);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }
    static comparePassword(password, passwordHash) {
        return bcrypt.compare(password, passwordHash);
    }
    
    static hashPassword(password) {
        return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .catch(handleError);
    }
    
    static generateNonce() {
        return bcrypt.genSalt(10);
    }
    
    static getClaims(user) {
        const name = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : undefined;
        return {
            sub: user._id,
            name,
            email: user.email
        };
    }

    generateToken(user) {
        return AuthService.generateNonce().then(nonce => {
            return this.userRepository.updateUser(user._id, {nonce}).then(u => {
                if(!u) {
                    return Promise.reject({status:404, message: 'User not found.'});
                }
                return jwt.sign(user, config.secret + nonce, {expiresIn:3600});
            });
        });
    }
    
    login(email, password) {
        return this.userRepository.findByEmail(email).then(user => {
            if (!user) {
                return Promise.reject({
                    status:401,
                    message:'Invalid email address.'
                });
            }
            return AuthService.comparePassword(password, user.passwordHash).then(isMatch => {
                if(!isMatch) {
                    return Promise.reject({
                        status:401,
                        message:'Invalid password.'
                    });
                }
                return this.generateToken(user.toObject()).then(token => {
                    return {
                        token,
                        claims: AuthService.getClaims(user.toObject())
                    };
                })
            });
        })
    }
    
    logout(token) {
        const decodedToken = jwt.decode(token);
        const userId = decodedToken._id;
        return this.userReopository.updateUser(userId, {nonce: null});
    }
}

function handleError(err) {
    console.error(err);
    return err;
}


module.exports = AuthService;



const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;
const awilix = require('awilix');

module.exports = (passport, container) => {
    const userService = container.resolve('userRepositoryTransient');
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKeyProvider: (request, rawJwtToken, done) => {
            const payload = jwt.decode(rawJwtToken);
            const userId = payload._id;
            userService.findById(userId).then(user => {
                done(null, config.secret + user.nonce);
            })
            .catch(error => {
                done({
                    status: 500,
                    message: 'Mongoose Error',
                    error
                }, null);
            });
        },
    }
    
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        userService.findById(jwt_payload._id).then(user => {
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        }).catch(err => {
            done(err, false);
        });
    }));
    passport = defineAuthenticateJwt(passport);
    return passport;
}


// always register currentUser after authenticate middleware has already run. So req.user is available.
function defineAuthenticateJwt(passport) {
    passport.authenticateJwt = () => [passport.authenticate('jwt', {session: false}), registerCurrentUserMiddleware];
    return passport;
}

function registerCurrentUserMiddleware(req, res, next) {   
    req.container.register({currentUser: awilix.asValue(req.user)});
    next();
}
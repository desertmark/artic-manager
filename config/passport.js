const config = require('../config/config.json');
const userService = require('../users/user-service');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = (passport) => {
    const opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.secret,
    //    issuer: 'accounts.examplesoft.com',
    //    audience: 'yoursite.net',
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
    return passport;
}

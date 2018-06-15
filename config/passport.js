const config = require('../config/config.json');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
ExtractJwt = require('passport-jwt').ExtractJwt;
const awilix = require('awilix');
const roleEnum = require('../users/roles-enum');

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
    passport.authenticateJwt = (role) => customAuthenticateMiddleware(passport, role);
    return passport;
}

function customAuthenticateMiddleware(passport, role) {
    return (req, res, next) => {
        passport.authenticate('jwt', {session: false, }, (err, user, info) => {
            console.log('err', err);
            console.log('user', user);
            console.log('info', info);
            // if anonymous role was especified for the endpoint we let anybody pass.
            if(role === roleEnum.ANONYMOUS) {
                req.container.register({currentUser: awilix.asValue(null)});
                return next();
            }
            //if user is not authenticated and no role or a role different than a anonymos is especified. 
            if(!user) {
                res.sendStatus(401);
            } else {
                // user is authenticated
                req.container.register({currentUser: awilix.asValue(user)});
                if(!role) {
                    // if no role was especified for this endpoint we let him pass.
                    return next();
                } else {
                    // a role was especified for this endpoint.
                    if(user.role === role) {
                        // we let him pass if the roles match.
                        return next();
                    } else {
                        // 403 if they don't
                        res.sendStatus(403);
                    }
                }
            }
        })(req, res, next);
    }
}

function registerCurrentUserMiddleware(req, res, next) {   
    req.container.register({currentUser: awilix.asValue(req.user)});
    next();
}
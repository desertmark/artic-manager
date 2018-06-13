// const router = require('express').Router();
// const userService = require('../users/user-service');
// const passport = require('passport');
// const authService = require('./auth-service');

// router.post('/login', (req,res) => {
//     authService.login(req.body.email, req.body.password)
//     .then(session => {
//         res.json(session);
//     })
//     .catch(err => {
//         console.error('POST: /login', err);
//         res.status(err.status || 500).json(err);
//     })
// });

// //TODO: Not working. Tokens are still valid after doing logout.
// router.get('/logout', passport.authenticate('jwt',{session:false}), (req, res) => {
//     const token = req.headers.authorization.split(" ")[1];
//     authService.logout(token).then(() => {
//         res.sendStatus(200);    
//     }).catch(err => {
//         res.status(err.status || 500).json(err);
//     });
    
// });

// router.get('/isAuthenticated', passport.authenticate('jwt', {session: false}), (req, res) => {
//     res.json({isAuthenticated: true});
// });

// module.exports = router;


const passport = require('passport');
const awilixExpress = require('awilix-express');
const AuthController = require('./auth-controller');

const ctrlBuilder = awilixExpress
.createController(AuthController)
.prefix('/auth')
.post('/login','login')
.get('/logout','logout',{before: passport.authenticateJwt()})
.get('./isAuthenticated','isAuthenticated', {before: passport.authenticateJwt()});

module.exports = ctrlBuilder;
const router = require('express').Router();
const userService = require('../users/user-service');
const passport = require('passport');
const authService = require('./auth-service');

router.post('/login', (req,res) => {
    authService.login(req.body.email, req.body.password)
    .then(session => {
        res.json(session);
    })
    .catch(err => {
        console.error('POST: /login', err);
        res.status(err.status || 500).json(err);
    })
});

//TODO: Not working. Tokens are still valid after doing logout.
router.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});

router.get('/isAuthenticated', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({isAuthenticated: true});
});

module.exports = router;
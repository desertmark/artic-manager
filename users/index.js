const router = require('express').Router();
const userService = require('../users/user-service');
const middlewares = require('./middlewares');
const passport = require('passport');

// This Endpoints are only available for Authenticated users.
router.use(passport.authenticate('jwt', {session: false}));

router.get('/:id', (req, res) => {
    userService.findById(req.params.id).then(user => {
        res.json(user);
    })
    .catch(err => {
        console.error('GET: /:id', err);
        res.status(err.status || 500).json(err);
    });;
});

router.get('/', (req, res) => {
    userService.listUsers().then(users => {
        res.json(users);
    })
    .catch(err => {
        console.error('GET: /:id', err);
        res.status(err.status || 500).json(err);
    });;
});

router.post('/',  middlewares.isAdmin, (req, res) => {
    userService.createUser(req.body).then(user => {
        res.json(user);
    })
    .catch(err => {
        console.error('POST: /', err);
        res.status(err.status || 500).json(err);
    });
});

module.exports = router;
const router = require('express').Router();
const userService = require('../users/user-service');

router.post('/', (req, res) => {
    userService.createUser(req.body).then(user => {
        res.json(user);
    })
    .catch(err => {
        console.error('POST: /', err);
        res.status(err.status || 500).json(err);
    });
});

module.exports = router;
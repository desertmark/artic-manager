class UserController {
    constructor(opts) {
        this.userRepository = opts.userRepository;
    }

    getAll(req, res) {
        this.userRepository.listUsers().then(users => {
            res.json(users);
        })
        .catch(err => {
            console.error('GET: /:id', err);
            res.status(err.status || 500).json(err);
        });
    }
}

module.exports = UserController;
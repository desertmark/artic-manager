class UserController {
    constructor(opts) {
        this.userRepository = opts.userRepository;
        this.getAll = this.getAll.bind(this);
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
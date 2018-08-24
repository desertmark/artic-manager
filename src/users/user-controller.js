class UserController {
    constructor(opts) {
        this.userRepository = opts.userRepository;
        this.getAll = this.getAll.bind(this);
        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
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

    get(req, res) {
        this.userRepository.findById(req.params.id).then(user => {
            res.json(user);
        })
        .catch(err => {
            console.error('GET: /:id', err);
            res.status(err.status || 500).json(err);
        });
    }

    put(req, res) {
        this.userRepository.updateUser(req.params.id, req.body).then(user => {
            res.json(user);
        })
        .catch(err => {
            console.error('PUT: /:id', err);
            res.status(err.status || 500).json(err);
        });
    }

    post(req, res) {
        this.userRepository.createUser(req.body).then(user => {
            res.json(user);
        })
        .catch(err => {
            console.error('POST: /', err);
            res.status(err.status || 500).json(err);
        });
    }
}

module.exports = UserController;
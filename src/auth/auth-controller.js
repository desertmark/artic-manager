class AuthController {
    constructor(opts) {
        this.authService = opts.authService;

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login(req,res) {
        this.authService.login(req.body.email, req.body.password)
        .then(session => {
            res.json(session);
        })
        .catch(err => {
            console.error('POST: /login', err);
            res.status(err.status || 500).json(err);
        });
    }

    logout(req, res) {
        const token = req.headers.authorization.split(" ")[1];
        this.authService.logout(token).then(() => {
            res.sendStatus(200);    
        }).catch(err => {
            res.status(err.status || 500).json(err);
        });
        
    }

    isAuthenticated(req,res) {
        res.json({isAuthenticated: true});
    }
}
module.exports = AuthController;
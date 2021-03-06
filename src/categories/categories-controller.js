class CategoriesController {
    constructor(opts) {
        this.categoriesRepository = opts.categoriesRepository;

        this.get = this.get.bind(this);
        this.getById = this.getById.bind(this);
        this.post = this.post.bind(this);
        this.delete = this.delete.bind(this);
    }

    get(req, res) {
        this.categoriesRepository.listCategories(req.query.page, req.query.size, req.query.q)
        .then(categories => {
            res.send(categories);
        })
        .catch(err => {
            console.error('GET: Category',err);
            res.status(500).send(err);
        })
    }
    
    getById(req,res) {
        this.categoriesRepository.findById(req.params.id)
        .then(category => {
            res.send(category);
        })
        .catch(err => {
            console.error('GET: /:id Category', err);
            res.status(err.status || 500).send(err);
        });
    }
    
    post(req,res) {
        this.categoriesRepository.createCategory(req.body.description).then(category => {
            res.status(201).send(category);
        })
        .catch(err => {
            console.error('POST: Category',err);
            res.status(err.status || 500).send(err);
        })
    }
    
    delete(req,res) {
        this.categoriesRepository.removeCategory(req.params.id).then(cat => {
            res.send({message: 'Category Removed.'});
        })
        .catch(err => {
            console.error('DELETE: /:id Category', err);
            res.status(err.status).send(err)
        });
    }
}

module.exports = CategoriesController;
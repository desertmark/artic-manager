class ArticlesController {
    constructor(opts) {
        this.articleRepository = opts.articleRepository;
        this.get = this.get.bind(this);
        this.getById = this.getById.bind(this);
        this.post = this.post.bind(this);
        this.postSearch = this.postSearch.bind(this);
        this.put = this.put.bind(this);
        this.delete = this.delete.bind(this);
    }

    get(req, res) {
        this.articleRepository.listArticles(req.query.page, req.query.size, {}, res.locals.fields)
        .then(articles => {
            console.log('GET: Articles', articles.length);
            res.send(articles);
        })
        .catch(err => {
            console.error('GET: Articles', err);
            res.status(500).send(err);
        });
    }
    
    getById(req,res) {
        res.send(res.locals.article.toObject());
    }
    
    post(req,res) {
        this.articleRepository.createArticle(req.body)
        .then(article => {
            console.log('POST: Articles', article);
            res.status(201).send(article);
        })
        .catch(err => {
            console.error('POST: Article', err);
            res.status(err.status).send(err);
        });
    }
    
    postSearch(req, res) {
        this.articleRepository.listArticles(req.query.page, req.query.size, req.body, res.locals.fields)
        .then(articles => {
            console.log('GET: Articles', articles.length);
            res.send(articles);
        })
        .catch(err => {
            console.error('GET: Articles', err);
            res.status(500).send(err);
        });
    }
    
    put(req, res) {
        req.body.id = res.locals.article._id;
        this.articleRepository.updateArticle(req.body)
        .then(article => {
            console.log('PUT: Articles', article)
            res.send();
        })
        .catch(err => {
            console.error('PUT: Article', err);
            res.status(err.status).send(err);
        });
    }
    
    delete(req,res) {
        this.articleRepository.removeArticle(res.locals.article._id)
        .then(article => {
            console.log('DELETE: Article', article);
            res.send();
        })
        .catch(err => {
            console.error('DELETE: Article', err);
            res.status(err.status).send(err);
        });
    }
}

module.exports = ArticlesController;
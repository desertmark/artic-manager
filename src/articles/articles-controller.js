const UpdateByCodeRangeModel = require('./models/updateByCodeRangeModel');
class ArticlesController {
    constructor(opts) {
        this.articleService = opts.articleService;
        this.fileService = opts.fileService;
        this.statusService = opts.statusService;

        this.get        = this.get.bind(this);
        this.getById    = this.getById.bind(this);
        this.post       = this.post.bind(this);
        this.postSearch = this.postSearch.bind(this);
        this.patch      = this.patch.bind(this);
        this.patchById  = this.patchById.bind(this);
        this.delete     = this.delete.bind(this);
    }

    get(req, res) {
        this.articleService.listArticles(req.query.page, req.query.size, {}, res.locals.fields)
        .then(queryResult => {
            console.log('GET: Articles', queryResult.articles.length);
            res.send(queryResult);
        })
        .catch(err => {
            console.error('GET: Articles', err);
            res.status(500).send(err);
        });
    }
    
    getById(req,res) {
        res.send(res.locals.article);
    }
    
    post(req,res) {
        this.articleService.createArticle(req.body)
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
        this.articleService.listArticles(req.query.page, req.query.size, req.body, res.locals.fields)
        .then(queryResult => {
            console.log('GET: Articles', queryResult.articles.length);
            res.send(queryResult);
        })
        .catch(err => {
            console.error('GET: Articles', err);
            res.status(500).send(err);
        });
    }
    
    patchById(req, res) {
        req.body.id = res.locals.article._id;
        this.articleService.updateArticle(req.body)
        .then(article => {
            console.log('PUT: Articles', article)
            res.send();
        })
        .catch(err => {
            console.error('PUT: Article', err);
            res.status(err.status).send(err);
        });
    }
    
    patch(req, res) {
        const bulkFile = req.files ? req.files.bulk : null;
        if(bulkFile) {
            if (!this.statusService.inProgress) {
                this.fileService.parseCsvFromStream(bulkFile).then(json =>{
                    this.articleService.updateByChunks(json);
                    console.log(`PATCH: Articles, By File. ${json.length} articles to process.`);
                    res.sendStatus(204);
                })
                .catch(err => {
                    console.error(`PATCH: Articles By File`, err);
                    res.status(500).send(err.toObject() || err.message);
                 });
                return;
            } else {
                res.sendStatus(409);
            }
        }
        
        // update by code range
        try {
            const model = new UpdateByCodeRangeModel(req.body);
            this.articleService.updateByCodeRange(model)
            .then(articles => {
                console.log('PATCH: Articles By Code Range', articles);
                res.send(articles);
            })
            .catch(err => {
                console.error('PATCH: Articles By Code Range', err);
                res.status(err.status).send(err.toObject());
            });
        } catch(error) {
            console.error('PATCH: Articles By Code Range', error);
            res.status(error.status || 500).send(error.toObject());
        }
    }

    delete(req, res) {
        this.articleService.removeArticle(res.locals.article._id)
        .then(article => {
            console.log('DELETE: Article', article);
            res.send();
        })
        .catch(err => {
            console.error('DELETE: Article', err);
            res.status(err.status).send(err);
        });
    }

    status(req, res) {
        const status = this.statusService.getStatus();
        res.json(status);
    }
}

module.exports = ArticlesController;
const middlewares = require('./articles-middlewares');
const awilix = require('awilix');
const awilixExpress = require('awilix-express');
const ArticlesController = require('./articles-controller');
const ctrlBuilder = awilixExpress
.createController(ArticlesController)
.prefix('/articles')
.get('/', 'get',{before: middlewares.parseFields})
.get('/:id', 'getById')
.post('/', 'post')
.post('/search', 'postSearch',{before: middlewares.parseFields})
.put('/:id', 'put')
.delete('/:id', 'delete');

const router = awilixExpress.controller(ctrlBuilder);
router.param('id', middleware.findById);


router.param('id', middlewares.findById);
router.get('/', middlewares.parseFields, (req, res) => {
    service.listArticles(req.query.page, req.query.size, {}, res.locals.fields)
    .then(articles => {
        console.log('GET: Articles', articles.length);
        res.send(articles);
    })
    .catch(err => {
        console.error('GET: Articles', err);
        res.status(500).send(err);
    });
});

router.get('/:id', (req,res) => {
    res.send(res.locals.article.toObject());
});

router.post('/', (req,res) => {
    service.createArticle(req.body)
    .then(article => {
        console.log('POST: Articles', article);
        res.status(201).send(article);
    })
    .catch(err => {
        console.error('POST: Article', err);
        res.status(err.status).send(err);
    });
});

router.post('/search', middlewares.parseFields, (req, res) => {
    service.listArticles(req.query.page, req.query.size, req.body, res.locals.fields)
    .then(articles => {
        console.log('GET: Articles', articles.length);
        res.send(articles);
    })
    .catch(err => {
        console.error('GET: Articles', err);
        res.status(500).send(err);
    });
});

router.put('/:id', (req, res) => {
    req.body.id = res.locals.article._id;
    service.updateArticle(req.body)
    .then(article => {
        console.log('PUT: Articles', article)
        res.send();
    })
    .catch(err => {
        console.error('PUT: Article', err);
        res.status(err.status).send(err);
    });
});

router.delete('/:id', (req,res) => {
    service.removeArticle(res.locals.article._id)
    .then(article => {
        console.log('DELETE: Article', article);
        res.send();
    })
    .catch(err => {
        console.error('DELETE: Article', err);
        res.status(err.status).send(err);
    });
});

module.exports = router;
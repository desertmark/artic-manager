const express = require('express');
const router = express.Router();
const Article = require('./articles.js');
const service = require('./articles-service.js');
const middlewares = require('./articles-middlewares');

router.param('id', middlewares.findById);

router.get('/', (req, res) => {
    service.list(req.query.page, req.query.size)
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
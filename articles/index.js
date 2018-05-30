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
    res.send(res.locals.article);
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
    })
});

router.put('/:id', (req,res) => {
    res.send('Update an Article');
});

router.delete('/:id', (req,res) => {
    res.send('Remove an Article');
});



module.exports = router;
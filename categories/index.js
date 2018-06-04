const express = require('express');
const router = express.Router();
const Category = require('./categories.js');
const service = require('./categories-service.js');

router.get('/', (req, res) => {
    service.listCategories(req.query.page, req.query.size, req.query.q)
    .then(categories => {
        res.send(categories);
    })
    .catch(err => {
        console.error('GET: Category',err);
        res.status(500).send(err);
    })
});

router.get('/:id', (req,res) => {
    service.findById(req.params.id)
    .then(category => {
        res.send(category);
    })
    .catch(err => {
        console.error('GET: /:id Category', err);
        res.status(err.status || 500).send(err);
    });
});

router.post('/', (req,res) => {
    service.createCategory(req.body.description).then(category => {
        res.status(201).send(category);
    })
    .catch(err => {
        console.error('POST: Category',err);
        res.status(err.status || 500).send(err);
    })
});

router.delete('/:id', (req,res) => {
    service.removeCategory(req.params.id).then(cat => {
        res.send({message: 'Category Removed.'});
    })
    .catch(err => {
        console.error('DELETE: /:id Category', err);
        res.status(err.status).send(err)
    });
});

module.exports = router;
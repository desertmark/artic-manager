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
        console.error(err);
        res.status(500).send(err);
    })
});

router.get('/:id', (req,res) => {
    res.send(req.params.id);
});

router.post('/', (req,res) => {
    res.status(201).send(req.params.id);
});

router.put('/:id', (req, res) => {
    res.send(req.params.id);
});

router.delete('/:id', (req,res) => {
    res.send(req.params.id);
});

module.exports = router;
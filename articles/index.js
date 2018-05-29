const express = require('express');
const router = express.Router();
const Article = require('./articles.js');


router.get('/', (req,res) => {
    Article.find().then(articles => {
        console.log('GET: Articles', articles.length);
        res.send(articles);
    })
    .catch(err => {
        console.error('GET: Articles', err);
        res.status(500).send(err);
    })
});

router.get('/:id', (req,res) => {
    res.send('Show Article`s details with id: ' + req.params.id);
});

router.post('/:id', (req,res) => {
    res.send('Create an Article');
});

router.put('/:id', (req,res) => {
    res.send('Update an Article');
});

router.delete('/:id', (req,res) => {
    res.send('Remove an Article');
});
module.exports = router;
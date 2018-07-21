const UpdateByCodeRangeModel = require('./models/updateByCodeRangeModel');
const csv = require('csvtojson');
const fs = require('fs');
const config = require('../config/config');
const path = require('path');
const uuidv4  = require('uuid/v4');
class ArticlesController {
    constructor(opts) {
        this.articleService = opts.articleService;
        this.fileService = opts.fileService;

        this.get        = this.get.bind(this);
        this.getById    = this.getById.bind(this);
        this.post       = this.post.bind(this);
        this.postSearch = this.postSearch.bind(this);
        this.put        = this.put.bind(this);
        this.delete     = this.delete.bind(this);
    }

    get(req, res) {
        this.articleService.listArticles(req.query.page, req.query.size, {}, res.locals.fields)
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
        .then(articles => {
            console.log('GET: Articles', articles.length);
            res.send(articles);
        })
        .catch(err => {
            console.error('GET: Articles', err);
            res.status(500).send(err);
        });
    }
    
    putById(req, res) {
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
    
    put(req, res) {
        const bulkFile = req.files ? req.files.bulk : null;
        if(bulkFile) {
            this.fileService.parseCsvFromFile(bulkFile).then(json =>{
                return this.articleService.updateBatch(json).then(articles => {
                    res.send(articles);
                });
            })
            .catch(err => {
                 res.status(500).send(err);
             });
            return;
        }
        const model = new UpdateByCodeRangeModel(req.body);
        if(model.isValid()) {
            // update by code range
            this.articleService.updateByCodeRange(model)
            .then(articles => {
                console.log('PUT: Articles By Code Range', articles);
                res.send(articles);
            })
            .catch(err => {
                console.error('PUT: Articles By Code Range', err);
                res.status(err.status).send(err.toObject());
            });
            return;
        }
        res.sendStatus(400);       
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
}

module.exports = ArticlesController;
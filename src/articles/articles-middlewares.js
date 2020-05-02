const articlesService = require('./articles-service');
const mongodb = require("mongodb");
const isValidObjectId = mongodb.ObjectID.isValid;
const { get, set } = require('lodash');

function findById(req, res, next, id) {
    if (!isValidObjectId(id)) {
        return res.status(400).send('Invalid Mongo Id');
    }
    const articleService = req.container.resolve('articleService');
    articleService.findById(id).then(article => {
        if (article) {
            res.locals.article = article;
            next();
        } else {
            res.status(404).send({
                status: 404,
                message: 'Article not found'
            });
        }
    })
        .catch(error => {
            console.error('findById:', error.message || error);
            res.status(500).send({
                status: 500,
                message: 'Mongoose Error',
                error
            });
        });
}

function parseFieldsToObject(req, res, next) {
    if (req.query && req.query.fields) {
        const fieldsArray = req.query.fields.split(",");
        let fields = {};
        fieldsArray.forEach(field => {
            fields[field] = 1;
        });
        res.locals.fields = fields;
    }
    next();
}

function parseFieldsToArray(req, res, next) {
    if (get(req, 'query.fields')) {
        set(res, 'locals.fields', req.query.fields.split(","))
    }
    next();
}

function parseFilterToObject(req, res, next) {
    const filter = {};
    if (req.query) {
        Object.keys(req.query).forEach(key => {
            if (isArticleProperty(key)) {
                set(filter, key, req.query[key]);
            }
        });
        res.locals.filter = filter;
    }
    next();
}

function isArticleProperty(prop) {
    return !['page','size','sort', 'fields'].includes(prop);
}

module.exports = {
    findById,
    parseFieldsToObject,
    parseFieldsToArray,
    parseFilterToObject,
};
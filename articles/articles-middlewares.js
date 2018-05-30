const articlesService = require('./articles-service');
const mongodb = require("mongodb");
const isValidObjectId = mongodb.ObjectID.isValid;

function findById(req ,res, next, id) {
    if (!isValidObjectId(id)) {
        return res.status(400).send('Invalid Id');
    }
    articlesService.findById(id).then(article => {
        if (article) {
            res.locals.article = article;
            next();
        } else {
            res.status(404).send('Article not found');
        }
    })
    .catch(err => {
        console.error('findById:', err.message || err);
        res.status(500).send(err.message || err);
    });
}

module.exports = {findById};
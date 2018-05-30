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
            res.status(404).send({
                status:404,
                message: 'Article not found'
            });
        }
    })
    .catch(error => {
        console.error('findById:', error.message || error);
        res.status(500).send({
            status:500,
            message: 'Mongoose Error',
            error
        });
    });
}

module.exports = {findById};
const Article = require('./articles');

function findById(id) {
    return Article.findById(id);
}

/**
 * Query Articles table and paginates results.
 * @param {Number} page Page number. Default is 0
 * @param {Number} pageSize Page Size. Default is 20
 * @param {Object} filter filter object to search by specific conditions or properties. Defaults is `{}`
 * @returns {DocumentQuery<Article>} DocumentQuery<Article>. call ``then`` to get results.
 */
function list(page, pageSize, filter = {}) {
    page = parseInt(page) || 0;
    size = parseInt(pageSize) || 20;
    return Article
    .find(filter)
    .sort('description')
    .skip(page*size)
    .limit(size)
}

function createArticle(articleJson) {
    let article;
    article = articleFactory(articleJson);
    if(article) {
        return Article
        .create(article)
        .catch(err => {
            return {
                status: 500,
                message:'Mongoose Error',
                error
            }
        });
    } else {
        return Promise.reject({
            status: 400,
            message: 'Invalid Article',
            error: Error('Invalid Article')
        });
    }
}

/**
 * Performs a partial article of the given fields. If succeeded returns the updated article.
 * @param {*} article 
 */
function updateArticle(article) {
    return Article.findByIdAndUpdate(article.id, { $set: article })
    .catch(err => {
        return {
            status: 500,
            message:'Mongoose Error',
            error
        }
    });
}

/**
 * Checks if all the mandatory properties are set with valid values.
 * @param {*} article 
 * @returns {Boolean} Boolean
 */
function isValid(article) {
    return article.code &&
        article.description &&
        article.cost > 0 &&
        article.listPrice > 0 &&
        article.dolar > 0 && 
        article.utility > 0 &&
        article.categoryId !== undefined;
}

/**
 * Creates an article object setting all optional props to default values if they're not specified.
 * @param {*} model A raw object with all mandatory properties set.
 */
function articleFactory(model) {
    if(!isValid(model)) {
        console.error('articleFactory: Article is not valid.', model);
        return null;
    }
    model.card            = model.card || 23;
    model.transport       = model.transport || 14;
    model.vat             = model.vat || 21;
    model.bonus           = model.bonus || 0
    model.bonus2          = model.bonus2 || 0
    model.cashDiscount    = model.cashDiscount || 0;
    model.cashDiscount2   = model.cashDiscount2 || 0;
    model.price = model.listPrice + model.listPrice*(-model.bonus/100 -model.bonus2/100 -model.cashDiscount/100 -model.cashDiscount2/100 + model.vat/100 + model.transport/100 + model.utility/100);
    return model;
}

module.exports = {
    findById,
    list,
    createArticle,
    updateArticle
}
const roleEnum = require('../users/roles-enum');
const _ = require('lodash');
const BusinessError = require('../util/errors').BusinessError;
class ArticleService {
    constructor(opts) {
        this.currentUser = opts.currentUser;
        this.articleRepository = opts.articleRepository;
        this.anonymouseAllowedFields = ["_id", "code", "category", "description"];
        this.userAllowedFields = ["_id", "code", "category", "description", "price", "cardPrice"];
    }

    findById(id) {
        return this.articleRepository.findById(id).then(article => {
            let fieldsToPick = this.getAllowedFields(null);
            return fieldsToPick ? _.pick(article, fieldsToPick) : article;
        });
    }
    
    /**
     * Query Articles table and paginates results.
     * @param {Number} page Page number. Default is 0.
     * @param {Number} pageSize Page Size. Default is 20.
     * @param {Object} filter filter object to search by code or partial description. Example is `{code:"00.00.55.03", description:"PVC"}`.
     * @param {Object | String} fields fields for the query to return. If not passed returns all of them. Pass it like ``{fieldName:1}`` or ``"fieldName1 fieldName2"``.
     * @returns {DocumentQuery<Article>} DocumentQuery<Article>. call ``then`` to get results.
     */
    listArticles(page, size, filter = {}, fields = null) {
        return this.articleRepository.listArticles(page, size, filter).then(articles => {
            let fieldsToPick= this.getAllowedFields(fields);
            return fieldsToPick ? articles.map(art => _.pick(art, fieldsToPick)) : articles;
        });
    }
    
    createArticle(articleJson) {
        let article;
        article = this.articleFactory(articleJson);
        if(article) {
            return this.articleRepository.createArticle(article)
        } else {
            return Promise.reject(new BusinessError('Invalid Article'));
        }
    }
    
    /**
     * Performs a partial update of the given fields. If succeeded returns the updated article.
     * @param {*} article 
     */
    updateArticle(article) {
        return this.articleRepository.updateArticle(article);
    }

    /**
     * updates those article's fields which codes are between the code range indicated by the model.
     * Expects: `
     * {
     *  from: string,
     *  to: string,
     *  fields: {
     *      [string]: string
     *  }
     * }
     * `
     * @param {*} model 
     */
    updateByCodeRange(model) {
        if(!this.isCodeRangeModelValid(model)) {
            return Promise.reject(new BusinessError('Invalid Model. Please specify from, to and what fields to update along with the values.'))
        }
        const codeFrom = model.from;
        const codeTo = model.to;
        const filter = {code:{$gte: codeFrom,$lte: codeTo}};
        const query = {$set: model.fields};
        return this.articleRepository.updateMany(filter, query, {upsert: false});
    }
    
    /**
     * Removes the article with the given id from the database.
     * @param {string} id
     */
    removeArticle(id) {
        return this.articleRepository.removeArticle(id);
    }
    
    /**
     * Checks if all the mandatory properties are set with valid values.
     * @param {*} article 
     * @returns {Boolean} Boolean
     */
    isValid(article) {
        return article.code         &&
            article.description     &&
            article.listPrice   > 0 &&
            article.dolar       > 0 && 
            article.utility     > 0 &&
            article.categoryId  !== undefined;
    }
    
    /**
     * Creates an article object setting all optional props to default values if they're not specified.
     * @param {*} model A raw object with all mandatory properties set.
     */
    articleFactory(model) {
        if(!this.isValid(model)) {
            console.error('articleFactory: Article is not valid.', model);
            return null;
        }
        model.card      = model.card || 0.23;
        model.transport = model.transport || 0.14;
        model.vat       = model.vat || 0.21;
        model.discounts = model.discounts || [];
        model.dolar     = model.dolar || 0;
        // model.price = model.listPrice + model.listPrice*(-model.bonus/100 -model.bonus2/100 -model.cashDiscount/100 -model.cashDiscount2/100 + model.vat/100 + model.transport/100 + model.utility/100);
        return model;
    }

    getAllowedFields(fields) {
        let fieldsToPick;
        if(!this.currentUser) {
            return fieldsToPick = fields ? _.intersection(this.anonymouseAllowedFields, fields) : this.anonymouseAllowedFields;
        } else {
            if(this.currentUser.role === roleEnum.USER) {
                return fieldsToPick = fields ? _.intersection(this.userAllowedFields, fields) : this.userAllowedFields;
            }
        }
        fieldsToPick = fields;
        return fieldsToPick;
    }

    /**
     * Parses formated code like "00.00.00.00" to its integer form.
     * @param {String} code 
     */
    parseCodeToInt(code) {
        return parseInt(code.replace(/[.]/g,''));
    }

    /**
     * Checks if the given model is a valid model to perform a bulk updateByCodeRange.
     * @param {*} model 
     */
    isCodeRangeModelValid(model) {
        return  typeof model.from === "number" &&
                typeof model.to   === "number" && 
                model.fields
    }
}



module.exports = ArticleService;
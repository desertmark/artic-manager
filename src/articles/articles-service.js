const roleEnum = require('../users/roles-enum');
const { pick, intersection, get } = require('lodash');
const { ValidationError } = require('../util/errors');
const { UpdateByCodeRangeModel, GuidoliArticle } = require('./models/');

class ArticleService {
    constructor(opts) {
        this.currentUser = opts.currentUser;
        this.articleRepository = opts.articleRepository;
        this.anonymouseAllowedFields = ["_id", "code", "codeString", "category", "description"];
        this.userAllowedFields = ["_id", "code", "codeString", "category", "description", "price", "cardPrice"];
    }

    findById(id) {
        return this.articleRepository.findById(id).then(article => {
            let fieldsToPick = this.getAllowedFields(null);
            return fieldsToPick ? pick(article, fieldsToPick) : article;
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
        return this.articleRepository.listArticles(page, size, filter).then(queryResult => {
            let fieldsToPick = this.getAllowedFields(fields);
            queryResult.articles = fieldsToPick ? queryResult.articles.map(art => pick(art, fieldsToPick)) : queryResult.articles;
            return queryResult;
        });
    }
    
    createArticle(articleJson) {
        let article;
        article = this.articleFactory(articleJson);
        if(article) {
            return this.articleRepository.createArticle(article)
        } else {
            return Promise.reject(new ValidationError('Invalid Article'));
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
     * @param {UpdateByCodeRangeModel} model
     * @param {any} model.price.percentage if especified, it will increase the price of the articles with the given percentage. 
     * i.e: 10 --> will increace price in 10%
     * @param {any} model.price.absolute if especified, it will increase the price of the articles with the given value.
     */
    updateByCodeRange(model) {
        if(!(model instanceof UpdateByCodeRangeModel)) {
            throw new ValidationError('Expected UpdateByCodeRangeModel instance as a parameter.');
        }
        return this.articleRepository.updateByCodeRange(model);
    }

    /**
     * Performs a partial updates of all the articles listed in the collections. If the article doesn't exist it doesn't creates it.
     * articles must detail _id or code property.
     * @param {*} articles 
     */
    updateBatch(articles) {
        let promises = [];
        articles.forEach(article => {
            // map raw json with changes to a type.
            const guidoliArticle = new GuidoliArticle(article);
            // find the article and perform all the changes.
            const promise = this.articleRepository.findByCode(guidoliArticle.codigo)
            .then(articleToUpdate => {
                if(articleToUpdate) {
                    const updatedArticle = this.updateArticleFromGuidoliArticle(articleToUpdate, guidoliArticle);
                    return updatedArticle.save()
                    .then(doc => {
                        console.log('Batch Update succesfull for article', doc.code);
                        return doc;
                    })
                    .catch(err => {
                        console.error('Batch Update fail for article', doc.code);
                        return err;
                    });
                }
            });
            promises.push(promise);
        });
        return Promise.all(promises)
        .then(docs =>{
            return docs;
        })
        .catch(err => {
            console.log('updateBatch (Articles): something happend while updating the articles. Is possible some of them were not correctly updated.');
            return err;
        });
    }

    /**
     * finds the discount with the provided description from the discounts property
     * @param {*} article 
     * @param {*} discountDescription 
     */
    findArticleDiscount(article, discountDescription) {
        return article.discounts ? article.discounts.find(dis => dis.description === discountDescription) : null;
    }

    /**
     * Updates the listPrice field and the bonifcacion and bonificacion2 discounts of articleToUpdate from guidoliArticle.
     * @param {*} articleToUpdate 
     * @param {*} guidoliArticle 
     */
    updateArticleFromGuidoliArticle(articleToUpdate, guidoliArticle) {
        articleToUpdate.listPrice = guidoliArticle.precio;
        const bonificacion = this.findArticleDiscount(articleToUpdate, 'Bonificacion');
        const bonificacion2 = this.findArticleDiscount(articleToUpdate, 'Bonificacion 2')
        if(bonificacion) bonificacion.amount = guidoliArticle.bonificacion;
        if(bonificacion2) bonificacion2.amount = guidoliArticle.bonificacion2;
        return articleToUpdate;
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
        // code regex validator is xx.xx.xx.xx where x = number;
        return /\d.[.]\d.[.]\d.[.]\d./.test(article.codeString) &&
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
        let article = Object.assign({
            code: parseInt(model.codeString.replace(/[.]/gm,'')),
            card: 0.23,
            transport: 0.14,
            vat: 0.21, 
            discounts: [],
            dolar: 0,
            category: model.categoryId
        }, model);
        delete model.categoryId;
        return article;
    }

    getAllowedFields(fields) {
        let fieldsToPick;
        if(!this.currentUser) {
            return fieldsToPick = fields ? intersection(this.anonymouseAllowedFields, fields) : this.anonymouseAllowedFields;
        } else {
            if(this.currentUser.role === roleEnum.USER) {
                return fieldsToPick = fields ? intersection(this.userAllowedFields, fields) : this.userAllowedFields;
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
}



module.exports = ArticleService;
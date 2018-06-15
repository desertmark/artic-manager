const roleEnum = require('../users/roles-enum');
class ArticleService {
    constructor(opts) {
        this.currentUser = opts.currentUser;
        this.articleRepository = opts.articleRepository;
    }

    findById(id) {

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
        const query = this.articleRepository.listArticles(page, size, filter, fields);
        query.select({
            code:1,
            description:1,
            category:1
        });
        if(this.currentUser && this.currentUser.role === roleEnum.USER) {
            query.select({
                bonus:0,
                bonus2:0,
                cashDiscount:0,
                cashDiscount2:0,
                cost:0,
                utility:0,
                listPrice:0,
                vat:0,
                dolar:0,
                transport:0,
                card:0
            });
        }
        return query;
    }
    
    createArticle(articleJson) {

    }
    
    /**
     * Performs a partial article of the given fields. If succeeded returns the updated article.
     * @param {*} article 
     */
    updateArticle(article) {

    }
    
    /**
     * Removes the article with the given id from the database.
     * @param {string} id
     */
    removeArticle(id) {

    }
    
    /**
     * Checks if all the mandatory properties are set with valid values.
     * @param {*} article 
     * @returns {Boolean} Boolean
     */
    isValid(article) {
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
    articleFactory(model) {
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
}



module.exports = ArticleService;
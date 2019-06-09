const _filter = require('lodash/filter');
const { queryFilter, categoryFilter } = require('./articles-filter-factory');
const { DatabaseError } = require('../util/errors');
const { get, omit, isEmpty } = require('lodash');
class ArticleRepository {
    constructor(opts) {
        this.Article = opts.Article;
    }

    findById(id) {
        return this.Article.findById(id).populate('category');
    }

    findByCode(code) {
        return this.Article.findOne({code: code}).populate('category');
    }
    
    /**
     * Query Articles table and paginates results.
     * @param {Number} page Page number. Default is 0.
     * @param {Number} pageSize Page Size. Default is 20.
     * @param {Object} filter filter object to search by code or partial description. Example is `{code:"00.00.55.03", description:"PVC"}`.
     * @param {Object | String} fields fields for the query to return. If not passed returns all of them. Pass it like ``{fieldName:1}`` or ``"fieldName1 fieldName2"``.
     * @returns {DocumentQuery<Article>} DocumentQuery<Article>. call ``then`` to get results.
     */
    listArticles(page, size, filter = {}) {
        page = parseInt(page) || 0;
        size = parseInt(size) || 20;
        
        const query = this.Article
            .find(queryFilter(filter))
            .populate({ path:'category', match: categoryFilter(filter) })
            .skip(page*size)
            .limit(size);
        const count = this.Article.count();
        return Promise
        .all([query, count])
        .then(([articles, totalSize]) => {
            return { 
                articles: _filter(articles, 'category'), // remove results withiout category.
                totalSize
            };
        });
    }
    
    createArticle(article) {
        return this.Article
        .create(article)
        .catch(err => new DatabaseError(err));
    }
    
    
    /**
     * Performs a partial article of the given fields. If succeeded returns the updated article.
     * @param {*} article 
     */
    updateArticle(article) {
        return this.Article.findByIdAndUpdate(article._id, { $set: article })
        .catch(err => {
            throw new DatabaseError(err);
        });
    }
    
    updateMany(filter, query) {
        return this.Article.updateMany(filter, query, {upsert: false})
        .catch(err => {
            throw new DatabaseError(err);
        });
    }

    updateByCodeRange(model) {
        const percentage = get(model, 'fields.price.percentage');
        const absolute = get(model, 'fields.price.absolute');
        const fields = omit(model.fields, 'price');
        const filter = { 
            code: { 
                $gte: model.from, 
                $lte: model.to 
            } 
        };
        const query = {};
        if(!isEmpty(fields)) query.$set = fields;
        if(percentage) query.$mul = { listPrice: 1 + percentage };
        if(absolute) query.$inc = { listPrice: absolute };
        return this.updateMany(filter, query);
    }

    /**
     * Removes the article with the given id from the database.
     * @param {string} id
     */
    removeArticle(id) {
        return this.Article.findByIdAndRemove(id)
        .catch(err => new DatabaseError(err));
    }
}



module.exports = ArticleRepository;
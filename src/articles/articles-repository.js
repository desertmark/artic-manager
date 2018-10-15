const get = require('lodash/get');
const mongoose = require('mongoose');
const MongooseError = require('../util/errors').MongooseError;
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
    
        // optional filters: matching codes and/or partial description match
        let queryFilter = {};

        if(filter.code) queryFilter.code = { $eq: filter.code };
        if(filter.description) queryFilter.description = { $regex: `.*${filter.description}.*` };

        let categoryFilter = {};
        if(filter.category) {
            if(filter.category._id) categoryFilter['category._id'] = { $eq: mongoose.mongo.ObjectId(filter.category._id) };
            if(filter.category.description) categoryFilter['category.description'] = { $regex: `.*${filter.category.description}.*` };
        }

        const pipeline = [
            { $match: queryFilter },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            { $unwind: '$category' },
            { $match: categoryFilter }
        ];

        const query = this.Article
        .aggregate(pipeline)
        .sort('description')
        .skip(page*size)
        .limit(size)
        
        const count = this.Article
        .aggregate(pipeline)
        .count('value');

        // Map aggregate model.
        return Promise
        .all([query, count])
        .then(([articles, [totalSize]]) => {
            articles = articles.map(a => new this.Article(a));
            return { articles, totalSize: get(totalSize, 'value', 0) };
        });
    }
    
    createArticle(article) {
        return this.Article
        .create(article)
        .catch(err => new MongooseError(err));
    }
    
    
    /**
     * Performs a partial article of the given fields. If succeeded returns the updated article.
     * @param {*} article 
     */
    updateArticle(article) {
        return this.Article.findByIdAndUpdate(article._id, { $set: article })
        .catch(err => new MongooseError(err));
    }
    
    updateMany(filter, query) {
        return this.Article.updateMany(filter, query, {upsert: false})
        .catch(err => new MongooseError(err));
    }

    /**
     * Removes the article with the given id from the database.
     * @param {string} id
     */
    removeArticle(id) {
        return this.Article.findByIdAndRemove(id)
        .catch(err => new MongooseError(err));
    }
}



module.exports = ArticleRepository;
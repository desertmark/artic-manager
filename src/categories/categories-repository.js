require('../util');
class CategoriesRepository {
    constructor(opts) {
        this.Category = opts.Category;
    }

    findById(id) {
        return this.Category.findById(id)
        .catch(err => {
            return {
                status: 500,
                message: 'Mongoose Error',
                error
            }
        });
    }

    /**
     * Query Categories table and paginates results.
     * @param {Number} page Page number. Default is 0.
     * @param {Number} pageSize Page Size. Default is 20.
     * @param {Object} filter filter object to search by code or partial description. Example is `{description:"Painting"}`.
     * @param {Object | String} fields fields for the query to return. If not passed returns all of them. Pass it like ``{fieldName:1}`` or ``"fieldName1 fieldName2"``.
     * @returns {DocumentQuery<Category>} DocumentQuery<Category>. call ``then`` to get results.
     */
    listCategories(page, size, filter) {
        page = parseInt(page) || 0;
        size = parseInt(size) || 20;

        // optional filters: matching codes and/or partial description match
        let queryFilter = {};
        if(filter) queryFilter.description = { $regex: new RegExp(`.*${filter}.*`,'i') };

        const query = this.Category
        .find(queryFilter)
        .sort('description')
        .skip(page*size) 
        .limit(size)
        return query;
    }

    /**
     * Takes a string with the category description and creates and stores in the database a new Category Document.
     * @param {String} category Category description
     * @returns {Promise<Category>} Returns a Promise of the new category with it's ObjectId loaded under ``_id`` property.
     */
    createCategory(category) {
        const formattedCategory = category.cleanSpaces().capitalize();
        return Category
        .count({description: formattedCategory})
        .then(count => {
            if(count > 0) {
                return Promise.reject({
                    message: 'Create Category Error: Category Already Exists', 
                    status:400
                });
            }
            return this.Category.create({description: formattedCategory})
            .catch(error => {
                return {
                    status: 500,
                    message: 'Mongoose Error: Create Category',
                    error
                }
            })
        });
    }
    /**
     * Removes a Category from the Database. If it not exists, it completes succesfully anyway.
     * @param {ObjectId} id CategoryId
     */
    removeCategory(id) {
        return this.Category.findByIdAndRemove(id)
        .catch(err => {
            return {
                status: 500,
                message: 'Mongoose Error',
                error
            }
        })
    }

}
module.exports = CategoriesRepository;
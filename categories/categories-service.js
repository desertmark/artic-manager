const Category = require('./categories');

function findById(id) {
    return Article.findById(id);
}

/**
 * Query Categories table and paginates results.
 * @param {Number} page Page number. Default is 0.
 * @param {Number} pageSize Page Size. Default is 20.
 * @param {Object} filter filter object to search by code or partial description. Example is `{description:"Painting"}`.
 * @param {Object | String} fields fields for the query to return. If not passed returns all of them. Pass it like ``{fieldName:1}`` or ``"fieldName1 fieldName2"``.
 * @returns {DocumentQuery<Category>} DocumentQuery<Category>. call ``then`` to get results.
 */
function listCategories(page, pageSize, filter) {
    page = parseInt(page) || 0;
    size = parseInt(pageSize) || 20;

    // optional filters: matching codes and/or partial description match
    let queryFilter = {};
    if(filter) queryFilter.description = { $regex: `.*${filter}.*` };

    const query = Category
    .find(queryFilter)
    .sort('description')
    .skip(page*size) 
    .limit(size)
    return query;
}


module.exports = {
    findById,
    listCategories
}
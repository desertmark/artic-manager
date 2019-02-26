function queryFilter(filter) {
    let queryFilter = {};
    
    if(filter.code) queryFilter.code = { $eq: filter.code };
    if(filter.codeString) queryFilter.codeString = { $regex: `.*${filter.codeString}.*` };
    if(filter.description) queryFilter.description = { $regex: `.*${filter.description}.*` };

    return queryFilter;
}

function categoryFilter(filter) {
    let categoryFilter = {};
    if(filter.category) {
        if(filter.category._id) categoryFilter._id = { $eq: mongoose.mongo.ObjectId(filter.category._id) };
        if(filter.category.description) categoryFilter.description = { $regex: `.*${filter.category.description}.*` };
    }
    return categoryFilter;
}

module.exports = {
    queryFilter,
    categoryFilter
}
const Article = require('./articles');
function findById(id) {
    return Article.findById(id);
}

module.exports = {
    findById
}
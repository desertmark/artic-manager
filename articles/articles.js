const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');

const Article = mongoose.model('Article', new Schema({
    name: String,
    description: String,
    code: String,
    price: Number
}));

module.exports = Article;

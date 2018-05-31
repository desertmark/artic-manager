const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');

const Category = mongoose.model('Category', new Schema({
    description: String
}));

module.exports = Category;
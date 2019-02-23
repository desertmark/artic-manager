const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Category = mongoose.model('Category', new Schema({
    description: String
}));

module.exports = Category;
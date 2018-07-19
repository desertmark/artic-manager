const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/config.js');
mongoose.connect(config.dbConnection);

const Category = mongoose.model('Category', new Schema({
    description: String
}));

module.exports = Category;
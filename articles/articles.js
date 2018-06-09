const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/config.json');
mongoose.connect(config.dbConnection);

const Article = mongoose.model('Article', new Schema({
    code:String,
    description:String,
    price:Number,
    bonus:Number,
    bonus2:Number,
    cashDiscount:Number,
    cashDiscount2:Number,
    cost:Number,
    utility:Number,
    listPrice:Number,
    vat:Number,
    dolar:Number,
    transport:Number,
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    card:Number
}));

module.exports = Article;

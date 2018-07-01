const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/config.json');
mongoose.connect(config.dbConnection);
const articleSchema = new Schema({
    code:String,
    description:String,
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
});
// NOTE: Don't use Arrow function, it causes "this" keyword to be equal to "{}" insetead of the model.
// NOTE: If we take out one of these colums using projection, the value here will be null.
articleSchema.virtual('price').get(function() {
    const price = this.cost*(1 + this.utility/100 + this.transport/100).toFixed(2);//toFixed returns string;
    return parseFloat(price);
})

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

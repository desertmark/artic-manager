const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/config.js');
const _ = require('lodash');
mongoose.connect(config.dbConnection);

const discountSchema = new Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true }
},
{
    id: false,
});
const articleSchema = new Schema({
    code:String,
    description:String,
    discounts: [discountSchema],
    utility:Number,
    listPrice:Number,
    vat:Number,
    dolar:Number,
    transport:Number,
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    card:Number
}, 
{
    id: false, 
    toObject:{virtuals:true}
});
// NOTE: Don't use Arrow function, it causes "this" keyword to be equal to "{}" insetead of the model.
// NOTE: If we take out one of these colums using projection, the value here will be null.
articleSchema.virtual('cost').get(function() {
    const totalDiscount = _.sumBy(this.discounts, 'amount');
    const cost = this.listPrice*(1 + this.vat - totalDiscount).toFixed(2);
    return parseFloat(cost);
});

articleSchema.virtual('price').get(function() {
    return this.cost*(1 + this.utility + this.transport);
});

articleSchema.virtual('cardPrice').get(function() {
    return this.price*(1 + this.card);
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

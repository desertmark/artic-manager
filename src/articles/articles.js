const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const _ = require('lodash');

const discountSchema = new Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true }
},
{
    id: false,
});
const articleSchema = new Schema({
    code:Number,
    codeString: String,
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
    toObject:{virtuals:true},
    toJSON:{virtuals:true}
});
// NOTE: Don't use Arrow function, it causes "this" keyword to be equal to "{}" insetead of the model.
// NOTE: If we take out one of these colums using projection, the value here will be null.
articleSchema.virtual('cost').get(function() {
    const totalDiscount = _.sumBy(this.discounts, 'amount');
    const cost = this.listPrice*(1 + this.vat - totalDiscount).toFixed(2);
    return parseFloat(cost);
});

articleSchema.virtual('price').get(function() {
    return parseFloat(this.cost*(1 + this.utility + this.transport).toFixed(2));
});

articleSchema.virtual('cardPrice').get(function() {
    return parseFloat(this.price*(1 + this.card).toFixed(2));
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;

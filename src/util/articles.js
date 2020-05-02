const sumBy = require('lodash/sumBy');

function cost(listPrice, vat, discounts = []) {
    const totalDiscount = sumBy(discounts, 'amount');
    const cost = listPrice*(1 + vat - totalDiscount).toFixed(2);
    return parseFloat(cost);
};

function price(cost, utility, transport) {
    return parseFloat(cost*(1 + utility + transport).toFixed(2));
};

function cardPrice(price, card) {
    return parseFloat(price*(1 + card).toFixed(2));
};

module.exports = {
    cost,
    price,
    cardPrice,
}
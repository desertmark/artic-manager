const Article = require('../articles.js');
describe("Article Model", () => {
    it("Should calculate the correct cost, price and cardPrice", () => {
        const article = new Article({
            listPrice: 100,
            vat: 0.21,
            discounts:[{
                amount:0.1
            },
            {
                amount:0.1
            },
            {
                amount:0.01
            }],
            utility: 0.1,
            card: 0.2,
            transport: 0.1
        });
        expect(article.cost).toEqual(100);
        expect(Math.floor(article.price)).toEqual(120);
        expect(article.cardPrice).toEqual(144);
    })
})
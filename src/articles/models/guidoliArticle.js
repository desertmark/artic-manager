module.exports = class GuidoliArtilce {
    constructor(article) {
        this.codigo = article["Codigo"];
        this.precio = article["Precio"];
        this.bonificacion = article["Bonif"];
        this.bonificacion2 = article["Bonif2"];
    }

    toArticle() {
        return {
            code: this.getIntCode(),
            listPrice: this.precio,
            discounts: [{
                    description:"Bonificacion",
                    amount: this.bonificacion
                },
                {
                    description: "Bonificacion2",
                    amount: this.bonificacion2
                }]
        };
    }

    getIntCode() {
        parseInt(this.codigo.replace(/[.]/g,''));
    }
}
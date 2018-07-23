module.exports = class GuidoliArticle {
    constructor(article) {
        this.codigo = parseInt(article["Codigo"].replace(/[.]/g,''));
        this.precio = parseFloat(article["Precio"]);
        this.bonificacion = parseFloat(article["Bonif"]);
        this.bonificacion2 = parseFloat(article["Bonif2"]);
    }
}
/**
 * File Header:
 * Código | Descripción | Precio | Bonif1 |	Bonif2 | Neto Final con IVA | Precio Cliente con Margen | Estado
 * To avoid troubles with words with special sybmols like `Código` get the values and extract by order.
 */

module.exports = class GuidoliArticle {
    constructor(article) {
        const values = Object.values(article);
        this.codigo        = parseInt(values[0].replace(/[.]/g,''));
        this.precio        = parseFloat(values[2]);
        this.bonificacion  = parseFloat(values[3]);
        this.bonificacion2 = parseFloat(values[4]);

        this.bonificacion  = (this.bonificacion  || 0) / 100;
        this.bonificacion2 = (this.bonificacion2 || 0) / 100;
    }
}
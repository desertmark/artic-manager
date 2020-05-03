
const csv = require('csvtojson');
const fs = require('fs');
csv({
    delimiter: ';',
}).fromFile('./src/data/sanita.csv').then(
    json => {
        console.log('rows:', json.length);
        console.log('first row:', json[0]);
        const sanita = transform(json);
        fs.writeFileSync('./src/data/sanita.json', JSON.stringify(sanita, null, 2));
    }
)

function transform(json = []) {
    const items = json.map(row => {
        return  {
            code: row.codigo,
            description: row.descripcion,
            price: parseFloatCustom(row.precio),
            bonus: parseFloatCustom(row.bonif),
            bonus2: parseFloatCustom(row.bonif2),
            cashDiscount: parseFloatCustom(row.caja1),
            cashDiscount2: parseFloatCustom(row.caja2),
            cost: parseFloatCustom(row.costo),
            utility: parseFloatCustom(row.utilidad),
            listPrice: parseFloatCustom(row.pl),
            vat: parseFloatCustom(row.iva),
            dolar: parseFloatCustom(row.dolar),
            transport: parseFloatCustom(row.flete),
            categoryDescription: row.rubro,
            card: parseFloatCustom(row.tarjeta),
          }
    });
    return items;
}

function parseFloatCustom(n) {
    return parseFloat(n.replace(',', '.'))
}
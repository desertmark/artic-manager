
const csv = require('csvtojson');
const fs = require('fs');
csv({
    delimiter: ';',
}).fromFile('./src/data/sanita.csv').then(
    json => {
        console.log('rows:', json.length);
        console.log('first row:', json[0]);
        const sanita = toJSON(json);
        const inserts = toSqlInsert(json);
        fs.writeFileSync('./src/data/sanita.json', JSON.stringify(sanita, null, 2));
        fs.writeFileSync('./src/data/sanita.sql', inserts);
    }
)

const insertTemplate = (values) => `INSERT INTO productos(codigo,descripcion,precio,bonif,bonif2,caja1,caja2,costo,utilidad,pl,iva,dolar,flete,rubro,tarjeta) VALUES (${values});`

function toSqlInsert(json = []) {
    const inserts = json.map(row => {
        const values = toInsertValues(row);
        return insertTemplate(values);
    });
    return inserts.join('\n');
}

function escapeQuotes(val) {
    return val.replace(/'/gm,"''");
}

function toInsertValues(row) {
    return [
        `'${escapeQuotes(row.codigo)}'`,
        `'${escapeQuotes(row.descripcion)}'`,
        parseFloatCustom(row.precio),
        parseFloatCustom(row.bonif),
        parseFloatCustom(row.bonif2),
        parseFloatCustom(row.caja1),
        parseFloatCustom(row.caja2),
        parseFloatCustom(row.costo),
        parseFloatCustom(row.utilidad),
        parseFloatCustom(row.pl),
        parseFloatCustom(row.iva),
        parseFloatCustom(row.dolar),
        parseFloatCustom(row.flete),
        `'${escapeQuotes(row.rubro)}'`,
        parseFloatCustom(row.tarjeta),
    ]
}

function toJsonItem(row) {
    return {
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
}

function toJSON(json = []) {
    const items = json.map(row => {
        return toJsonItem(row)
    });
    return items;
}

function parseFloatCustom(n) {
    return parseFloat(n.replace(',', '.'))
}
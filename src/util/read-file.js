const fs = require('fs');
const csv = require('csv');
const header = ["Codigo",
    "Descripcion",
    "Precio",
    "Bonif1",
    "Bonif2",
    "Neto",
    "Final_con_IVA",
    "Precio",
    "Cliente_con_Margen",
    "Estado"
];

// csv.generate({seed: 1, columns: 2, length: 1}, function(err, data) {
//     console.log(data);
// })
const path = './guidoli.csv';
fs.readFile(path, 'utf8', (err,data) =>{
    csv.parse(data, {delimiter:';', from: 5}, (error, dataArray) => {
        let objects = dataArray.map(item => {
            let obj = {};
            header.forEach((key,ix) => {
                obj[key] = item[ix]
            });
            return obj;
        });
        console.log(objects);
    })
})
const fs = require('fs');
const readline = require('readline');
const csv = require('csv');
/**
 * READ FILE LINE BY LINE.
 */

const path = './test.txt';
let rs = fs.createReadStream(path);
const rlInterface = readline.createInterface({
    input: rs,
    terminal: false
});

const header = ['col1', 'col2', 'col3'];
const data = [];


function toObject(array) {
    let obj = {};
    header.forEach((h,ix) => {
        obj[h] = array[ix];
    });
    return obj;
}

rlInterface
.on('line', (line) => {
    csv.parse(line, 
    {
        delimiter:';',
    },
    (err, array) => {
        const obj = toObject(array[0]);
        data.push(obj)
    });
})// file needs to end with a new line, other wise last line will be lost.
.on('close', () => {
    console.log(data);
});


const csvtojson = require('csvtojson')
csvtojson({delimiter:[";"]})
.fromFile(path)
.then((jsonObj)=>{
    console.log(jsonObj);
})
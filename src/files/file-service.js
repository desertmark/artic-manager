const csv = require('csvtojson');

class FileService {
    constructor() {
        this.csvOptions =  {delimiter:';'}
    }

    /**
     * Expects an object with a data prop with the file content.
     * data prop can be a byte buffer or string.
     * @param { buffer | string } csvFile.data 
     */
    parseCsvFromStream(csvFile) {
        return csv(this.csvOptions).fromString(csvFile.data.toString())
    }

}

module.exports = FileService;
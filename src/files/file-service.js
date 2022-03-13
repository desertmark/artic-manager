const csv = require('csvtojson');
const axios = require('axios');
const FormData = require('form-data');
const config = require('../config/config');
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

    /**
     * Expects an object with a data prop with the file content.
     * data prop can be a byte buffer or string.
     * @param { buffer | string } xlsFile.data 
     */
    parseXls(xlsFile) {
        const form = new FormData();
        form.append('file', xlsFile.data, xlsFile.name || 'file');
        form.append('headerIndex', 3);
        return axios.post(config.parseServiceUrl, form, {
            headers: {
                ...form.getHeaders()
            }
        })
        .then(res => {
            const json = res.data.data
            return json;
        })
        .catch(error => {
            console.error('Failed to parse xls file.', { error, xlsFile });
            throw error;
        });
    }

}

module.exports = FileService;
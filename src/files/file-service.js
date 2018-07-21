const csv = require('csvtojson');
const fs = require('fs');
const config = require('../config/config');
const path = require('path');
const uuidv4  = require('uuid/v4');

class FileService {
    constructor() {
        this.csvOptions =  {delimiter:';'}

        this.parseCsvFromFilePath = this.parseCsvFromFilePath.bind(this);
    }
    /**
     * Parses a the given csv file to 
     */
    parseCsvFromFile(csvFile) {
        return this.storeAndDeleteAfter(csvFile, this.parseCsvFromFilePath);
    }

    /**
     * Parses a csv file located in the given path.
     * @param {string} filePath 
     */
    parseCsvFromFilePath(filePath) {
        return csv(this.csvOptions).fromFile(filePath).then(json => {
            return json;
        })
        .catch(err => {
            console.log(err);
        });
    }
    /**
     * Stores a file temporarily in the /public dir and deltes it after the given task is completed.
     * @param {*} file 
     */
    storeAndDeleteAfter(file, taskCb) {
        const filePath = this.getTempFileName('csv');
        const deleteFile = () => fs.unlink(filePath);
        return file.mv(filePath)
        .then(() => taskCb(filePath)
            .then(result => {
                deleteFile();
                return result;
            }))
        .catch(deleteFile)
    }

    /**
     * Generates a file random name using the given extension in the /public folder.
     * @param {string} extension file extension to use in the file name
     */
    getTempFileName(extension) {
        return path.join(config.publicPath, `${uuidv4()}.${extension}`);
    }
}

module.exports = FileService;
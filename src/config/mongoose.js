const config = require('./config');
const mongoose = require('mongoose');
module.exports = function initMongoose() {
    return mongoose.connect(config.dbConnection)
        .then(() => console.log('Mongoose Connected to', config.dbConnection))
        .catch(error => {
            console.error(`Error while connecting mongoose to the database using ${config.dbConnection}. Reason: `, error);
        });
}
const config = require('./config');
const mongoose = require('mongoose');
const conn = process.env.DATABASE_URL || config.dbConnection;
module.exports = function initMongoose() {
    return mongoose.connect(conn)
        .then(() => console.log('Mongoose Connected to', conn))
        .catch(error => {
            console.error(`Error while connecting mongoose to the database using ${conn}. Reason: `, error);
        });
}
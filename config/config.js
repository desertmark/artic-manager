const config = require('./config.json');

module.exports = {
    dbConnection: process.env.DATABASE_URL || config.dbConnection,
    secret: config.secret
}
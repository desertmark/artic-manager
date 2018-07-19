const env = (process.env.NODE_ENV || 'DEV').toLowerCase();
const config = require(`./config.${env}.json`);
const path = require('path');
config.publicPath = path.resolve(path.join('./', config.publicPath));

module.exports = config;
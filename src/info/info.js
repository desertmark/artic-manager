const PORT_NUMBER = process.env.PORT || 3001 ;
const config      = require('../config/config.js');
const package     = require('./package.json');

module.exports = Promise.resolve({
        status: `App is running on port: ${PORT_NUMBER}`,
        env: config.env,
        version: package.version
});


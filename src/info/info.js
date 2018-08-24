const PORT_NUMBER = process.env.PORT || 3001 ;
const config      = require('../config/config.js');
const version     = require('./version.json');
module.exports = {
        status: `App is running on port: ${PORT_NUMBER}`,
        env: config.env,
        version: version.name,
        msg: version.msg
}
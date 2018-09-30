const PORT_NUMBER = process.env.PORT || 3001 ;
const config      = require('../config/config.js');
const getVersion  = require('../util/version');

module.exports = getVersion.then(version => {
        return {
                status: `App is running on port: ${PORT_NUMBER}`,
                env: config.env,
                version: version.name,
                msg: version.msg
        }
});


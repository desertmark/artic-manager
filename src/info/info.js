const PORT_NUMBER = process.env.PORT || 3001 ;
const config      = require('../config/config.js');

module.exports = Promise.resolve({
        status: `App is running on port: ${PORT_NUMBER}`,
        env: config.env,
});


const env = (process.env.NODE_ENV || 'DEV').toLowerCase();
const config = require(`./config.${env}.json`);

// switch (process.env.NODE_ENV) {
//     case 'Production':
//     break;
//     case 'QA':
//     break;
//     case 'DEV':
//     break;
//     default:
//     break;
// }

module.exports = config;
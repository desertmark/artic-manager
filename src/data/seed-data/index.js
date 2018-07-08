const seedAdmin = require('./seed-users').seedAdmin;

module.exports = function() {
    seedAdmin()
    .catch(error => {
        console.error('seedAdmin: ', error);
    });
}
const roleEnum = require('./roles-enum');
/**
 * Checks if a user has a admin role.
 * Assumes user has been already checked for authentication and the token is valid.
 */
function isAdmin(req, res, next) {
    if(req.user.role === roleEnum.ADMIN) {
        req.user.isAdmin = true;
        next()
    } else {
        res.sendStatu(403);
    }
}

module.exports = {
    isAdmin
}
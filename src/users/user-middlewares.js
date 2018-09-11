const roleEnum = require('./roles-enum');
/**
 * Checks if a user has a admin role.
 * Assumes user has been already checked for authentication and the token is valid.
 */
function isAdmin(req, res, next) {
    if(hasAdminRole(req.user)) {
        req.user.isAdmin = true;
        next()
    } else {
        res.sendStatus(403);
    }
}

/**
 * Checks if the user who's not an admin is accessing or not to his own information.
 */
function isHimselfOrAdmin(req, res, next) {
    req.user && (req.user.role === roleEnum.ADMIN || req.user._id.toString() === req.params.id) ? next() : res.sendStatus(403);
}

/**
 * Checks if a non admin user is trying to change the user role. Prevents a user to set an admin role to himself or others.
 */
function isRoleEditing(req, res, next) {
    !hasAdminRole(req.user) && req.body.role !== req.user.role ? res.sendStatus(403) : next();
}

function hasAdminRole(user) {
    return user && user.role === roleEnum.ADMIN
}

module.exports = {
    isAdmin,
    isHimselfOrAdmin,
    isRoleEditing
}
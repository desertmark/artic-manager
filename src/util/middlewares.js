const { get, set } = require('lodash');
function parseSorting(req, res, next) {
    if (get(req,'query.sort')) {
        set(res, 'locals.sort', req.query.sort.split(','))
    }
    next();
}

module.exports = {
    parseSorting,
}
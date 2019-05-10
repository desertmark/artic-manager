/**
 * Takes a formatted code and returns it as a number.
 * @param {string} code string with format `05.05.05.05` where x are numbers.
 */
function parseCode(code) {
    return parseInt(code.replace(/[.]+/gm,''));
}

module.exports = {
    parseCode
}
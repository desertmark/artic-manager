String.prototype.capitalize = function() {
    if(!this) {
        return undefined;
    }
    return this
    .toString()
    .toLowerCase()
    .replace(/\b[a-z]/g, (char)=> char.toUpperCase());
}

String.prototype.cleanSpaces = function() {
    if(!this) {
        return undefined;
    }
    return this
    .toString()
    .trim()
    .replace(/\s+/g,' ');
}

module.exports = String.prototype
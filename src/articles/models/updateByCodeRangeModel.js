const { parseCode } = require('../articles-utils');
module.exports = class UpdateByCodeRangeModel {
    constructor(obj = {}) {
        this.from = parseCode(obj.from);
        this.to = parseCode(obj.to);
        this.fields = obj.fields;
    }

    isValid() {
        return this.fields
            && Number.isInteger(this.from)
            && Number.isInteger(this.to)
            && typeof this.fields === 'object'
    }
}
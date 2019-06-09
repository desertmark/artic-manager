const { parseCode } = require('../articles-utils');
const { ValidationError } = require('../../util/errors');
module.exports = class UpdateByCodeRangeModel {
    constructor(model = {}) {
        try {
            this.from = parseCode(model.from);
            this.to = parseCode(model.to);
            this.fields = model.fields;
            if(!this.isValid(model)) {
                throw new ValidationError('Invalid Model. Please specify from, to and what fields to update along with the values.');
            }
        } catch(error) {
            throw new ValidationError('Invalid "from" and "to" codes.', 422, error);
        }
    }

    isValid(model) {
        return model.fields
            && Number.isInteger(model.from)
            && Number.isInteger(model.to)
            && typeof model.fields === 'object'
    }
}
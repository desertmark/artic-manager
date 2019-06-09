const { parseCode } = require('../articles-utils');
const { ValidationError } = require('../../util/errors');
const { isNumber } = require('lodash');
module.exports = class UpdateByCodeRangeModel {
    constructor(model = {}) {
        try {
            this.from = parseCode(model.from);
            this.to = parseCode(model.to);
            this.fields = model.fields || {};
        } catch(error) {
            throw new ValidationError('Invalid "from" and "to" codes.', 422, error);
        }
        if(!this.isValid(model)) {
            throw new ValidationError('Invalid Model. Please specify from, to and what fields to update along with the values.');
        }
    }

    isValid() {
        const { transport, vat, card, utility } = this.fields;
        return (!transport || isNumber(transport))
            && (!vat || isNumber(vat))
            && (!card || isNumber(card))
            && (!utility || isNumber(utility))
            && Number.isInteger(this.from)
            && Number.isInteger(this.to)
    }
}
module.exports = class UpdateByCodeRangeModel {
    constructor(obj = {}) {
        this.from = obj.from;
        this.to = obj.to;
        this.fields = obj.fields;
    }

    isValid() {
        return this.fields
            && Number.isInteger(this.from)
            && Number.isInteger(this.to)
            && typeof this.fields === 'object'
    }
}
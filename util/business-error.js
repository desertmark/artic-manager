module.exports = class BusinessError extends Error {
    constructor(message = 'BusinessError', status = 400) {
        super(message);
        this.status = status;
        this.error = message;
    }
}
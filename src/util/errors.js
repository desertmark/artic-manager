Error.prototype.toObject = function() {
    return {
        message: this.message
    }
}

class ApplicationError extends Error {
    constructor(message = 'Application Error', status, error = null) {
        super();
        this.message = message;
        this.status = status;
        this.error = error;
        this.name = 'ApplicationError'
    }
    toObject() {
        return {
            message: this.message,
            status: this.status,
            error: this.error
        }
    }
}

class ValidationError extends ApplicationError {
    constructor(message = 'Validation Error', status = 422, error = null) {
        super(message, status, error);
        this.name = "ValidationError"
    }
}

class DatabaseError extends ApplicationError {
    constructor(error = null){
        super('Mongoose Error', 500, error);
    }
}

module.exports.ValidationError = ValidationError;
module.exports.DatabaseError = DatabaseError;
module.exports.ApplicationError = ApplicationError;
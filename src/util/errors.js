Error.prototype.toObject = function() {
    return {
        message: this.message
    }
}

class BusinessError extends Error {
    constructor(message = 'Business Error', status = 400, error = null) {
        super(message);
        this.message = message;
        this.status = status;
        this.error = error;
    }

    toObject() {
        return {
            message: this.message,
            status: this.status,
            error: this.error
        }
    }
}

class MongooseError extends BusinessError {
    constructor(error = null){
        super('Mongoose Error', 500, error);
    }
}

class InternalServerError extends Error {
    constructor(message, error = null){
        super(message, 500, error);
    }
}

module.exports.BusinessError = BusinessError;
module.exports.MongooseError = MongooseError;
module.exports.InternalServerError = InternalServerError;
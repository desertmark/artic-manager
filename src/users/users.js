const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    nonce: String,
    firstName: String,
    lastName: String,
    role: {type:String, require: true}
},
{
    toObject: {
        transform: function (doc, ret) {
            delete ret.passwordHash;
            return ret;
        } 
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret.passwordHash;
            return ret;
        }
    }
});
module.exports = mongoose.model('User', userSchema);

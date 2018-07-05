const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require('../config/config.js');
mongoose.connect(config.dbConnection);

module.exports = mongoose.model('User', new Schema({
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    nonce: String,
    firstName: String,
    lastName: String,
    role: {type:String, require: true}
}));
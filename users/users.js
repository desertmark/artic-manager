const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');

module.exports = mongoose.model('User', new Schema({
    email: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    firstName: String,
    lastName: String
}));
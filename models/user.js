const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    createdon: { type: Date, default: Date.now }
});
const Users = mongoose.model('users', UserSchema)
module.exports = Users;
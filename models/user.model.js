let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let config = require('../config/secret.json');

let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    discord_token: String,
    hash: String,
    salt: String,
});

userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
};

userSchema.methods.checkPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function () {
    console.log('trying');

    return jwt.sign({
        _id: this._id,
        hash: this.hash
    }, config.secret_key);
};

module.exports = mongoose.model('User', userSchema);
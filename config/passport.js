let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');
let userModel = require('../models/user.model');

passport.use(new LocalStrategy({
    usernameField: 'email'
}, function (username, password, done) {
    userModel.findOne({
        email: username
    }, function (err, user) {

        if (err) {
            return done(err);
        }

        if (!user) {
            console.log('No user');
            return done(null, false, {
                message: 'User not found'
            });
        }

        if (!user.checkPassword(password)) {
            console.log('Wrong password');
            return done(null, false, {
                message: 'Incorrect password'
            });
        }

        return done(null, user);
    });
}));
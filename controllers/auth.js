let passport = require('passport');
let mongoose = require('mongoose');
let User = mongoose.model('User');
let config = require('../config/secret.json');
let validate = require('../utilities/validate');
let crypto = require('crypto');
const { catchAsync } = require('../utilities/catchAsync');

let sendJSONResponse = (res, status, content) => {
    res.status(status);
    res.send(content);
};

module.exports.register = catchAsync(async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        sendJSONResponse(res, 400, {
            message: 'All fields required'
        });
    } else {
        let userByEmail = await User.findOne({email: req.body.email});

        if (userByEmail) {
            sendJSONResponse(res, 400, {
                message: 'That email has already been registered!'
            });

            return;
        }

        let userByName = await User.findOne({username: req.body.username});

        if (userByName) {
            sendJSONResponse(res, 400, {
                message: 'That username has already been registered!'
            });

            return;
        }

        let validation = validate.validate([
            {
                value: req.body.username,
                checks: {
                    required: true,
                    minlength: 3,
                    maxlength: 18,
                    regex: /^[a-zA-Z0-9_-]*$/
                }
            },
            {
                value: req.body.email,
                checks: {
                    required: true,
                    minlength: 3,
                    maxlength: 100,
                    regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                }
            },
            {
                value: req.body.password,
                checks: {
                    required: true,
                    matches: req.body.confirm,
                    minlength: 8,
                    maxlength: 100
                }
            }
        ]);

        if (validation.passed) {
            let user = new User();
            user.username = req.body.username;
            user.email = req.body.email;
            user.setPassword(req.body.password);

            user.save(function (err) {
                console.log('fuck');
                if (err) {
                    console.log(err);
                    return;
                }

                let token;
                token = user.generateJwt();
                res.status(200);
                res.send({
                    token: token
                });
            });
        } else {
            sendJSONResponse(res, 401, {
                message: 'Invalid input. Please don\'t mess with Angular\'s form validation.'
            });

            console.dir(validation.errors);
        }
    }
});

module.exports.login = catchAsync(async (req, res) => {
    if (!req.body.email || !req.body.password) {
        sendJSONResponse(res, 400, {
            message: 'All fields required'
        });
    } else {
        passport.authenticate('local', function (err, user, info) {
            let token;
            if (err) {
                sendJSONResponse(res, 404, {
                    message: 'Error!'
                });
            } else if (user) {
                token = user.generateJwt();
                sendJSONResponse(res, 200, {
                    token: token
                });
            } else {
                res.status(401).json(info);
            }
        })(req, res);
    }
});

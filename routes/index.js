const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();
const agile = require('../controllers/agile');
const user = require('../controllers/user');
let authentication = require('../controllers/auth');
const secret = require('../config/secret.json');

let auth = jwt({
    secret: secret.secret_key,
    userProperty: 'payload'
});

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


router.get('/all-issues', agile.allIssues);
router.get('/issue-list', agile.issueList);
router.get('/issue/:id', agile.getIssue);
router.get('/retro-list', agile.retroList);
router.get('/current-retro', agile.currentRetro);

router.post('/create-issue', agile.createIssue);
router.post('/update-issue/:id', agile.updateIssue);
router.post('/create-retro', agile.createRetro);
router.post('/update-retro/:id', agile.updateRetro);

router.post('/register', authentication.register);
router.post('/login', authentication.login);



module.exports = router;

let RetroModel = require('../models/retro.model');
let IssueModel = require('../models/issue.model');
const { catchAsync } = require('../utilities/catchAsync');

exports.allIssues = catchAsync(async (req, res) => {
    let retroList = await RetroModel.find({});
    let issueList = await IssueModel.find({});

    let struct = retroList.map(retro => {
        return {
            _id: retro._id,
            start_date: retro.start_date,
            end_date: retro.end_date,
            issues: issueList.filter(issue => {
                return issue.retrospective.equals(retro._id);
            }),
            current: retro.current
        };
    });

    res.status(200).json(struct);
});

exports.issueList = catchAsync(async (req, res) => {
    let retro = await RetroModel.findOne({current: true});
    let issues = await IssueModel.find({retrospective: retro._id});

    res.status(200).send(issues);
});

exports.getIssue = catchAsync(async (req, res) => {
    let issue = await IssueModel.findById(req.params.id);
    res.status(200).send(issue);
});

exports.retroList = catchAsync(async (req, res) => {
    let retros = await RetroModel.find({});
    res.status(200).send(retros);
});

exports.currentRetro = catchAsync(async (req, res) => {
    let retro = await RetroModel.find({current: true});
    res.status(200).send(retro);
});

exports.createIssue = catchAsync(async (req, res) => {
    let issue = new IssueModel();
    let retro = await RetroModel.findOne({ current: true });

    issue.title = req.body.title;
    issue.problem = req.body.problem;
    issue.author = req.body.author;
    issue.retrospective = retro._id;

    issue.save().then(() => {
        res.status(200).send(issue);
    });
});

exports.updateIssue = catchAsync(async (req, res) => {
    let issue = await IssueModel.findByIdAndUpdate(req.params.id, {
        problem: req.body.problem,
        author: req.body.author,
        title: req.body.title,
        solve: req.body.solve
    });

    res.status(200).send(issue)
});

exports.createRetro = (req, res) => {
    let newRetro = new RetroModel();
    newRetro.current = req.body.current;
    newRetro.start_date = req.body.start_date;

    newRetro.save().then(retro => {
        res.status(200).send(retro);
    });
};

exports.updateRetro = catchAsync(async (req, res) => {
    let retro = await RetroModel.findByIdAndUpdate(req.params.id, {
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        current: req.body.current
    });

    res.status(200).send(retro);
});


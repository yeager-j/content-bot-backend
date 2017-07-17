let mongoose = require('mongoose');

let issueSchema = new mongoose.Schema({
    problem: {
        type: String,
        required: true
    },
    solve: {
        type: String
    },
    retrospective: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Retrospective',
        required: true
    },
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Issue', issueSchema);
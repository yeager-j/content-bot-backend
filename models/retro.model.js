let mongoose = require('mongoose');

let retroSchema = new mongoose.Schema({
    start_date: {
        type: Date,
        default: Date.now
    },
    end_date: {
        type: Date
    },
    current: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Retrospective', retroSchema);
const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    teams: Array,
    scores: Array,
    date: { type: Date,default: Date.now },
    location: String,
    // Add other fields as needed
});

const Match = mongoose.model('Match',matchSchema);

module.exports = Match;

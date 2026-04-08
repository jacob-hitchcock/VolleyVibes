const mongoose = require('mongoose');

/**
 * Match schema.
 * Structural validation (teams must be exactly 2 arrays, scores exactly 2 numbers)
 * is enforced at the API layer in server.js using express-validator.
 * The schema stays minimal and trusts that validated data arrives here.
 */
const matchSchema = new mongoose.Schema({
    teams: {
        type: Array,
        required: [true, 'teams is required'],
    },
    scores: {
        type: Array,
        required: [true, 'scores is required'],
    },
    date: {
        type: Date,
        required: [true, 'date is required'],
        default: Date.now,
    },
    location: {
        type: String,
        trim: true,
    },
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;

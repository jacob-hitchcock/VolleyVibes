const mongoose = require('mongoose');

/**
 * Player schema.
 * Stat fields (wins, pointsFor, etc.) are managed server-side by updatePlayerStats()
 * and should not be set directly by the client when creating a player.
 */
const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Player name is required'],
        trim: true,
        maxlength: [100, 'Name must be 100 characters or fewer'],
    },
    age: {
        type: Number,
        min: [0, 'Age cannot be negative'],
        max: [120, 'Age must be 120 or less'],
    },
    gender: {
        type: String,
        enum: {
            values: ['Male', 'Female', 'Other', 'Prefer not to say'],
            message: 'Gender must be one of: Male, Female, Other, Prefer not to say',
        },
    },
    wins: { type: Number, default: 0 },
    pointsFor: { type: Number, default: 0 },
    pointsAgainst: { type: Number, default: 0 },
    pointDifferential: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;

const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String,required: true },
    age: Number,
    gender: String,
    wins: { type: Number,default: 0 },
    pointsFor: { type: Number,default: 0 },
    pointsAgainst: { type: Number,default: 0 },
    pointDifferential: { type: Number,default: 0 },
    gamesPlayed: { type: Number,default: 0 }  // Add this line
    // Add other fields as needed
});

const Player = mongoose.model('Player',playerSchema);

module.exports = Player;

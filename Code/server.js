const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Player = require('./models/Player');
const Match = require('./models/Match');
const loginRoute = require('./routes/Login');
const authMiddleware = require('./middlewares/authMiddleware'); // Import the middleware
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}))

console.log('Starting server...');

// Connect to MongoDB Atlas
const dbURI = 'mongodb+srv://Cluster36644:QXNaeXdqZ3pU@cluster36644.tofuamk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster36644';
mongoose.connect(dbURI,{
    writeConcern: {
        w: 'majority',
        wtimeout: 5000,
        j: true
    }
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:',err);
        process.exit(1); // Exit the process with failure
    });

// Use the login route
app.use('/api/users',loginRoute);

// Protect the routes using the auth middleware

// Protected routes for Players
app.post('/api/players',authMiddleware,async (req,res) => {
    const player = new Player(req.body);
    try {
        await player.save();
        res.status(201).send(player);
    } catch(error) {
        res.status(400).send(error);
    }
});

app.put('/api/players/:id',authMiddleware,async (req,res) => {
    const { id } = req.params;
    try {
        const player = await Player.findByIdAndUpdate(id,req.body,{ new: true,runValidators: true });
        if(!player) {
            return res.status(404).send({ message: 'Player not found' });
        }
        res.send(player);
    } catch(error) {
        res.status(400).send(error);
    }
});

app.delete('/api/players/:id',authMiddleware,async (req,res) => {
    const { id } = req.params;
    try {
        const player = await Player.findByIdAndDelete(id);
        if(!player) {
            return res.status(404).send({ message: 'Player not found' });
        }
        res.send({ message: 'Player deleted' });
    } catch(error) {
        res.status(500).send(error);
    }
});

// Protected routes for Matches
app.post('/api/matches',authMiddleware,async (req,res) => {
    const match = new Match(req.body);
    try {
        await match.save();
        await updatePlayerStats(req.body);
        res.status(201).send(match);
    } catch(error) {
        res.status(400).send(error);
    }
});

app.put('/api/matches/:id',authMiddleware,async (req,res) => {
    const { id } = req.params;
    try {
        const match = await Match.findByIdAndUpdate(id,req.body,{ new: true,runValidators: true });
        if(!match) {
            return res.status(404).send({ message: 'Match not found' });
        }
        res.send(match);
    } catch(error) {
        res.status(400).send(error);
    }
});

app.delete('/api/matches/:id',authMiddleware,async (req,res) => {
    const { id } = req.params;
    try {
        const match = await Match.findByIdAndDelete(id);
        if(!match) {
            return res.status(404).send({ message: 'Match not found' });
        }
        res.send({ message: 'Match deleted' });
    } catch(error) {
        res.status(500).send(error);
    }
});

// Public routes for Matches
app.get('/api/matches',async (req,res) => {
    try {
        const matches = await Match.find();
        res.send(matches);
    } catch(error) {
        res.status(500).send(error);
    }
});

app.get('/api/matches/:id',async (req,res) => {
    const { id } = req.params;
    try {
        const match = await Match.findById(id);
        if(!match) {
            return res.status(404).send({ message: 'Match not found' });
        }
        res.send(match);
    } catch(error) {
        res.status(500).send(error);
    }
});

// Public routes for Players
app.get('/api/players',async (req,res) => {
    try {
        const players = await Player.find();
        res.send(players);
    } catch(error) {
        res.status(500).send(error);
    }
});

app.get('/api/players/:id',async (req,res) => {
    const { id } = req.params;
    try {
        const player = await Player.findById(id);
        if(!player) {
            return res.status(404).send({ message: 'Player not found' });
        }
        res.send(player);
    } catch(error) {
        res.status(500).send(error);
    }
});

// Function to update player stats
const updatePlayerStats = async (match) => {
    const teamA = match.teams[0];
    const teamB = match.teams[1];
    const scoreA = parseInt(match.scores[0]);
    const scoreB = parseInt(match.scores[1]);

    let winningTeam = [];
    if(scoreA > scoreB) {
        winningTeam = teamA;
    } else if(scoreB > scoreA) {
        winningTeam = teamB;
    }

    console.log('Updating player stats...');
    console.log('Match:',match);

    const updatePlayer = async (playerId,pointsFor,pointsAgainst) => {
        const player = await Player.findById(playerId);
        if(player) {
            player.wins = player.wins || 0;
            player.pointsFor = player.pointsFor || 0;
            player.pointsAgainst = player.pointsAgainst || 0;
            player.pointDifferential = player.pointDifferential || 0;
            player.gamesPlayed = player.gamesPlayed || 0;  // Initialize gamesPlayed

            player.gamesPlayed += 1;  // Increment gamesPlayed
            player.wins += winningTeam.includes(playerId) ? 1 : 0;
            player.pointsFor += pointsFor;
            player.pointsAgainst += pointsAgainst;
            player.pointDifferential += pointsFor - pointsAgainst;
            console.log('Updated Player:',player);
            await player.save();
        }
    };

    // Update stats for Team A
    for(const playerId of teamA) {
        await updatePlayer(playerId,scoreA,scoreB);
    }

    // Update stats for Team B
    for(const playerId of teamB) {
        await updatePlayer(playerId,scoreB,scoreA);
    }
};

// Basic route for testing
app.get('/',(req,res) => {
    res.send('Hello World!');
});

app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
});
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Player = require('./models/Player');
const Match = require('./models/Match');
const loginRoute = require('./routes/login');
const authMiddleware = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');

const app = express();
const port = process.env.PORT || 3000; // Use the environment variable PORT or default to 3000

// Middleware to parse JSON bodies
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

// CORS configuration
const allowedOrigins = ['https://volleyvibes.vercel.app']; // Add your Vercel domain here

app.use(cors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies) to be sent and received
}));

console.log('Starting server...');
console.log('NODE_ENV:',process.env.NODE_ENV);

// Connect to MongoDB Atlas using environment variables
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
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

    const updatePlayer = async (playerId,pointsFor,pointsAgainst) => {
        const player = await Player.findById(playerId);
        if(player) {
            player.wins = player.wins || 0;
            player.pointsFor = player.pointsFor || 0;
            player.pointsAgainst = player.pointsAgainst || 0;
            player.pointDifferential = player.pointDifferential || 0;
            player.gamesPlayed = player.gamesPlayed || 0; // Initialize gamesPlayed

            player.gamesPlayed += 1; // Increment gamesPlayed
            player.wins += winningTeam.includes(playerId) ? 1 : 0;
            player.pointsFor += pointsFor;
            player.pointsAgainst += pointsAgainst;
            player.pointDifferential += pointsFor - pointsAgainst;
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

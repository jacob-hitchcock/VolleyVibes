require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Player = require('./models/Player');
const Match = require('./models/Match');
const loginRoute = require('./routes/login');
const authMiddleware = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');

console.log('JWT_SECRET:',process.env.JWT_SECRET ? 'Loaded' : 'Missing');

const app = express();
const port = process.env.PORT || 3000; // Use the environment variable PORT or default to 3000

// Middleware to parse JSON bodies
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

// CORS configuration
const allowedOrigins = ['https://volleyvibes.vercel.app','https://jacobhitchcock.com','https://www.jacobhitchcock.com','http://localhost:3001']; // Add your Vercel domain here

app.use(cors({
    origin: (origin,callback) => {
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null,true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies) to be sent and received
}));

console.log('Starting server...');

// Connect to MongoDB Atlas using environment variables
const dbURI = process.env.MONGODB_URI;
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
        res.status(201).json(player);
    } catch(error) {
        console.error(error);
        res.status(400).json({ message: error.message || 'Failed to create player.' });
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
        console.error(error);
        res.status(400).json({ message: error.message || 'An error occurred' });
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
        console.error(error);
        res.status(500).json({ message: error.message || 'An error occurred' });
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
        console.error(error)
        res.status(400).json({ message: error.message || 'An error occurred' });
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
        console.error(error)
        res.status(400).json({ message: error.message || 'An error occurred' });
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
        console.error(error)
        res.status(500).json({ message: error.message || 'An error occurred' });
    }
});

// Public routes for Matches
app.get('/api/matches',async (req,res) => {
    try {
        const matches = await Match.find();
        res.json(matches);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'An error occurred' });
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
        console.error(error)
        res.status(500).json({ message: error.message || 'An error occurred' });
    }
});

// Public routes for Players
app.get('/api/players',async (req,res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'An error occurred' });
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
        console.error(error)
        res.status(500).json({ message: error.message || 'An error occurred' });
    }
});

app.get('/api/players/:id/last10', async (req, res) => {
  const playerId = req.params.id;

  try {

    const matches = await Match.find({
      "teams": { $elemMatch: { $elemMatch: { $eq: playerId } } }
    })
      .sort({ date: -1, _id: -1 })
      .limit(10);

    if (matches.length === 0) {
      return res.json({
        wins: 0,
        losses: 0,
        record: '0-0',
        totalMatchesFound: 0
      });
    }

    let wins = 0;
    let losses = 0;
    for (const [index, match] of matches.entries()) {
      const [teamA, teamB] = match.teams;
      const [scoreA, scoreB] = match.scores.map(Number);

      const onTeamA = teamA.includes(playerId);
      const onTeamB = teamB.includes(playerId);

      const playerTeam = onTeamA ? 'Team A' : onTeamB ? 'Team B' : 'None';
      const playerWon =
        (onTeamA && scoreA > scoreB) ||
        (onTeamB && scoreB > scoreA);

      if (playerWon) wins++;
      else losses++;
    }

    res.json({
      wins,
      losses,
      record: `${wins}-${losses}`,
      totalMatchesFound: matches.length
    });
  } catch (error) {
    console.error('❌ Error fetching last 10 record:', error);
    res.status(500).json({ message: error.message || 'An error occurred' });
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

// Helper to calculate a player's last 10 record
const getLastTenRecord = async (playerId) => {
    // Find all matches involving the player
    const matches = await Match.find({
        $or: [
            { 'teams.0': playerId },
            { 'teams.1': playerId },
            { teams: playerId } // fallback if structure varies
        ]
    }).sort({ date: -1 }).limit(10);

    let wins = 0;
    let losses = 0;

    matches.forEach(match => {
        const teamA = match.teams[0];
        const teamB = match.teams[1];
        const scoreA = parseInt(match.scores[0]);
        const scoreB = parseInt(match.scores[1]);

        let playerOnA = Array.isArray(teamA) && teamA.includes(playerId);
        let playerOnB = Array.isArray(teamB) && teamB.includes(playerId);

        const teamAWon = scoreA > scoreB;
        const teamBWon = scoreB > scoreA;

        if (playerOnA && teamAWon) wins++;
        else if (playerOnB && teamBWon) wins++;
        else losses++;
    })

    return {
        wins,
        losses,
        record: `${wins}-${losses}`
    };
}

// Basic route for testing
app.get('/',(req,res) => {
    res.send('Hello World!');
});

app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
});

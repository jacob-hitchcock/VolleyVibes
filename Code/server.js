require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const Player = require('./models/Player');
const Match = require('./models/Match');
const loginRoute = require('./routes/login');
const authMiddleware = require('./middlewares/authMiddleware');
const adminMiddleware = require('./middlewares/adminMiddleware');

/**
 * Checks the request for express-validator errors and responds with 400 if any exist.
 * Returns true if errors were found (caller should return early), false otherwise.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {boolean}
 */
const handleValidationErrors = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
        return true;
    }
    return false;
};


const app = express();
const port = process.env.PORT || 3000; // Use the environment variable PORT or default to 3000

// Middleware to parse JSON bodies
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

// CORS configuration — allowed origins are set via the ALLOWED_ORIGINS env var (comma-separated).
// Falls back to localhost only if the env var is not set.
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3001'];

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

// Connect to MongoDB Atlas using environment variables
const dbURI = process.env.MONGODB_URI;
mongoose.connect(dbURI,{
    writeConcern: {
        w: 'majority',
        wtimeout: 5000,
        j: true
    }
})
    .then(() => console.log('MongoDB connected — server ready'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:',err);
        process.exit(1);
    });

// Use the login route
app.use('/api/users',loginRoute);

// Protect the routes using the auth middleware

// Protected routes for Players
app.post('/api/players',
    authMiddleware,
    [
        body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name must be 100 characters or fewer'),
        body('age').optional({ nullable: true }).isInt({ min: 0, max: 120 }).withMessage('Age must be a whole number between 0 and 120'),
        body('gender').notEmpty().withMessage('Gender is required').isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Gender must be one of: Male, Female, Other, Prefer not to say'),
    ],
    async (req,res) => {
        if (handleValidationErrors(req, res)) return;
        const player = new Player(req.body);
        try {
            await player.save();
            res.status(201).json(player);
        } catch(error) {
            console.error(error);
            res.status(400).json({ message: error.message || 'Failed to create player.' });
        }
    }
);

app.put('/api/players/:id',authMiddleware,async (req,res) => {
    const { id } = req.params;
    try {
        const player = await Player.findByIdAndUpdate(id,req.body,{ new: true,runValidators: true });
        if(!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
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
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json({ message: 'Player deleted' });
    } catch(error) {
        console.error(error);
        res.status(500).json({ message: error.message || 'An error occurred' });
    }
});

// Protected routes for Matches
app.post('/api/matches',
    authMiddleware,
    [
        body('teams').isArray({ min: 2, max: 2 }).withMessage('teams must be an array of exactly 2 teams'),
        body('teams.*').isArray({ min: 1 }).withMessage('Each team must be a non-empty array of player IDs'),
        body('scores').isArray({ min: 2, max: 2 }).withMessage('scores must be an array of exactly 2 numbers'),
        body('scores.*').isInt({ min: 0 }).withMessage('Each score must be a non-negative integer'),
        body('date').notEmpty().withMessage('date is required').isISO8601().withMessage('date must be a valid ISO 8601 date string'),
        body('location').optional().isString().withMessage('location must be a string'),
    ],
    async (req,res) => {
        if (handleValidationErrors(req, res)) return;
        const match = new Match(req.body);
        try {
            await match.save();
            await updatePlayerStats(req.body);
            res.status(201).json(match);
        } catch(error) {
            console.error(error)
            res.status(400).json({ message: error.message || 'An error occurred' });
        }
    }
);

app.put('/api/matches/:id',authMiddleware,async (req,res) => {
    const { id } = req.params;
    try {
        const match = await Match.findByIdAndUpdate(id,req.body,{ new: true,runValidators: true });
        if(!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json(match);
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
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json({ message: 'Match deleted' });
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
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json(match);
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
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch(error) {
        console.error(error)
        res.status(500).json({ message: error.message || 'An error occurred' });
    }
});

// Returns a player's win/loss record for their most recent 10 matches.
// Uses $elemMatch on the nested teams array (teams is an array of arrays of player IDs).
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

// Basic route for testing
app.get('/',(req,res) => {
    res.send('Hello World!');
});

app.listen(port,() => {
    console.log(`Server is running on http://localhost:${port}`);
});

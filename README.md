# DO NOT MAKE PUBLIC UNTIL YOU REMOVE CLUSTER PASSWORD IN SERVER BACKEND
# VolleyVibes

VolleyVibes is a web application designed to manage volleyball bjerring tournaments and player statistics. The frontend is built using React, and the backend is built with Node.js and Express, connecting to a MongoDB database to store data.

## Features

### Player Management
- Add, view, update, and delete player information.

### Match Management
- Record match details.
- Update player statistics based on match outcomes.
- View match history.

### User Profile
- Manage user profiles.

### Leaderboard
- View a leaderboard of players ranked by wins.
- Sort the leaderboard by different columns (name, wins, points for, points against, point differential).

## Tech Stack

### Frontend
- **React**: Provides the user interface for the application.
- **react-router-dom**: Used for routing between different pages in the application.
- **axios**: Used for making HTTP requests to the backend.

### Backend
- **Node.js**: JavaScript runtime.
- **Express**: Web framework for Node.js.
- **Mongoose**: Used for modeling and managing MongoDB data.

### Database
- **MongoDB**: NoSQL database for storing application data.

## Directory Structure

```bash
├── client                   # Frontend code (React)
│   ├── public               # Public assets
│   └── src                  # Source code
│       ├── components       # Reusable React components
│       ├── pages            # React components representing different pages
│       │   ├── HomePage.js
│       │   ├── MatchManagement.js
│       │   ├── PlayerManagement.js
│       │   └── UserProfile.js
│       ├── App.js           # Main application component
│       └── index.js         # Entry point for the React application
├── fonts                    # Font styles
├── models                   # Mongoose models
│   ├── Player.js
│   └── Match.js
├──server.js                 # Main server file
├── package.json             # Backend dependencies and scripts
└── .gitignore               # Git ignore file
```

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB

### Setup Instructions
1. Clone the repository
2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```
3. Set up MongoDB:
   - Make sure MongoDB is running on your local machine or provide a MongoDB URI in the environment variables.
4. Run the application:
```bash
# Start the backend server
cd server
npm start

# Start the frontend development server
cd ../client
npm start
```
5. Open your browser and navigate to http://localhost:3000 to view the application.

## API Endpoints

### Player Routes
- GET /api/players: Get all players.
- POST /api/players: Add a new player.
- GET /api/players/:id: Get player by ID.
- PUT /api/players/:id: Update player by ID.
- DELETE /api/players/:id: Delete player by ID.

### Match Routes
- GET /api/matches: Get all matches.
- POST /api/matches: Add a new match.
- GET /api/matches/:id: Get match by ID.
- PUT /api/matches/:id: Update match by ID.
- DELETE /api/matches/:id: Delete match by ID.

## Contributions
Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

# VolleyVibe

VolleyVibe can now be accessed at [jacobhitchcock.com](https://jacobhitchcock.com). The website is in a more cost effective, spun-down state most of the time so backend data may take 50 seconds or more to populate. Please be patient or feel free to contact me to request an more streamlined instance, see [Contact](#contact).


VolleyVibe is a comprehensive volleyball match management application designed to streamline the process of organizing matches, tracking player statistics, and generating player combinations for future matches. The application features a user-friendly interface with robust functionalities for administrators to manage matches and players efficiently.


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Components Overview](#components-overview)
- [Routes](#routes)
- [Contact](#contact)
- [License](#license)

## Features

### Match Management
- **Add and Manage Matches**: Administrators can add new matches, update match details, and delete matches.
- **Filter and Sort Matches**: Matches can be filtered by dates and locations. Sorting options are available for various match attributes.
- **View Match Details**: Detailed information about each match is accessible through a modal dialog.

### Player Management
- **Add and Manage Players**: Administrators can add new players, edit player information, and delete players.
- **Track Player Statistics**: The application calculates and displays player statistics such as wins, losses, points for, points against, and winning percentage.

### Combination Generator
- **Generate Player Combinations**: Users can select players and generate random match combinations.
- **Display Matchups**: The generated combinations are displayed, and users can mark matchups as completed.
- **Save and Load Combinations**: Generated combinations are saved to local storage, allowing persistence across sessions.
- **NEW: Predict Winning Team**: Uses existing match history to predict which team is most likely to win a matchup, including predicted score.

## Tech Stack

### Frontend
- **React**: The main JavaScript library for building the user interface.
- **React Router**: Used for navigation and routing within the application.
- **Axios**: Used for making HTTP requests to the backend API.
- **CSS**: For styling the application.

### Backend
- **Node.js**: The runtime environment for the backend server.
- **Express**: The web framework used for building the API.
- **MongoDB**: The database for storing match and player data.
- **Mongoose**: An ODM library for MongoDB, used to define schemas and interact with the database.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/jacob-hitchcock/volleyvibe.git
    cd volleyvibe
    ```

2. Install the dependencies for both the frontend and backend:
    ```sh
    npm install
    cd client
    npm install
    cd ..
    ```

## Environment Variables

Create a `.env` file in the root of the project and add the following environment variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

For the frontend, create a `.env` file in the `client` directory and add:

```
REACT_APP_API_BASE_URL=your_backend_api_base_url
```

## Running the Application

1. Start the backend server:
    ```sh
    npm start
    ```

2. Start the frontend development server:
    ```sh
    cd client
    npm start
    ```

## Components Overview

### Frontend Components
- **NavBar**: Navigation bar component.
- **Sidebar**: Sidebar component for navigation.
- **ManagePlayers**: Component for managing players.
- **LogoutButton**: Button for logging out.
- **AddMatch**: Component for adding matches.
- **ReturnToTop**: Button for returning to the top of the page.
- **FilterBar**: Component for filtering matches and players.
- **MatchGrid**: Component for displaying matches in a grid format.
- **MatchDetailsModal**: Modal dialog for viewing match details.
- **AdminPlayerTable**: Component for adding, editing, and deleting players.
- **ComboControls**: Controls for specifying number of desired combo matchups.
- **Dropdown**: Drop component for filtering.
- **Footer**: Footer component.
- **Leaderboard**: Component for displaying aggregated player stats.
- **MatchCard**: Component for displaying basic match details.
- **MatchupCard**: Component for displaying random combination matchup.
- **MatchupList**: Component for displaying list of combination matchups.
- **PlayerCheckboxList**: Checkboxes for selecting players for generating matchups.
- **PlayerForm**: Form for creating new players.
- **PlayerTable**: Component for displaying all existing players.
- **ProtectedRoute**: Route for designating pages as protected.
- **SearchBar**: Component for searching player table.
- **TeamSelection**: Component for assigning players to teams.

### Backend Components
- **Player**: Mongoose model for player data.
- **Match**: Mongoose model for match data.
- **User**: Mongoose model for user data.

## Routes

### Public Routes
- `GET /api/matches`: Get all matches.
- `GET /api/matches/:id`: Get a specific match by ID.
- `GET /api/players`: Get all players.
- `GET /api/players/:id`: Get a specific player by ID.

### Protected Routes (Require Authentication)
- `POST /api/players`: Add a new player.
- `PUT /api/players/:id`: Update player information.
- `DELETE /api/players/:id`: Delete a player.
- `POST /api/matches`: Add a new match.
- `PUT /api/matches/:id`: Update match information.
- `DELETE /api/matches/:id`: Delete a match.

## Contact

Email: jacob.hitchcock1@gmail.com

## License

This project is licensed under the MIT License.

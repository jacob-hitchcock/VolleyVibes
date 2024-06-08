// src/App.js
import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayerManagement from './pages/PlayerManagement';
import MatchManagement from './pages/MatchManagement';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayerManagement />} />
        <Route path="/matches" element={<MatchManagement />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;

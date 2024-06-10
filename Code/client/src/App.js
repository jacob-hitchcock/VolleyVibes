// src/App.js
import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PlayerManagement from './pages/PlayerManagement';
import MatchManagement from './pages/MatchManagement';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayerManagement />} />
        <Route path="/matches" element={<MatchManagement />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;

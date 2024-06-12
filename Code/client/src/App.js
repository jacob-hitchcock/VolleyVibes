// src/App.js
import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import PlayerManagement from './pages/PlayerManagement';
import MatchManagement from './pages/MatchManagement';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/players" element={<PlayerManagement />} />
          <Route path="/matches" element={<MatchManagement />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

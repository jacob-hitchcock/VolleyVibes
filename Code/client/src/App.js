import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import PlayerManagement from './pages/PlayerManagement';
import MatchManagement from './pages/MatchManagement';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
import PlayerProfile from './pages/PlayerProfile';
import Combos from './pages/Combos';
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
          <Route path="/combos" element={<Combos />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<PlayerProfile />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}

export default App;

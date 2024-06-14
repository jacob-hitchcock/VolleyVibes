import React from 'react';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import PlayerManagement from './pages/PlayerManagement';
import MatchManagement from './pages/MatchManagement';
import TermsOfService from './pages/TermsOfService';
import Contact from './pages/Contact';
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
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
      <Analytics />
    </AuthProvider>
  );
}

export default App;

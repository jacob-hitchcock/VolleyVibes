// src/components/PlayerDashboard.js

import React,{ useContext } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LineChart from '../charts/LineChart';
import useFetchData from '../hooks/useFetchData';
import AuthContext from '../context/AuthContext'; // Adjust the path as needed
import { getPossessiveForm } from '../utils/utils'; // Import utility functions
import useFilters from '../hooks/useFilters'; // Import the useFilters hook
import usePlayerPerformance from '../hooks/usePlayerPerformance'; // Import the new hook

const PlayerDashboard = () => {
  const { auth } = useContext(AuthContext);
  const { playerId } = useParams();
  const { matches,players,loading,error } = useFetchData();

  const { didPlayerTeamWin } = useFilters(); // Only use didPlayerTeamWin from useFilters

  const playerData = players.find(player => player._id === playerId);

  const playerStats = usePlayerPerformance(playerId,matches,didPlayerTeamWin);

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error loading player data.</div>;

  if(!auth.user || auth.user.role !== 'admin') {
    return (
      <div className="player-dashboard">
        <NavBar />
        <h1>New and exciting things coming soon!</h1>
        <Footer />
      </div>
    );
  }

  return (
    <div className="player-dashboard">
      <NavBar />
      <h1>{getPossessiveForm(playerData?.name)} Dashboard</h1>
      <div className="charts-container">
        {playerStats && <LineChart data={playerStats.performanceOverTime} />}
        {/* Add other charts as needed */}
      </div>
      <Footer />
    </div>
  );
};

export default PlayerDashboard;

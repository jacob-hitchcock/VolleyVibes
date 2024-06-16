// src/components/PlayerDashboard.js
import React,{ useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Grid,Typography,Box } from '@mui/material';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LineChart from '../charts/LineChart';
import StatCard from '../components/StatCard';
import useFetchData from '../hooks/useFetchData';
import AuthContext from '../context/AuthContext';
import { getPossessiveForm } from '../utils/utils';
import useFilters from '../hooks/useFilters';
import usePlayerPerformance from '../hooks/usePlayerPerformance';

const PlayerDashboard = () => {
  const { auth } = useContext(AuthContext);
  const { playerId } = useParams();
  const { matches,players,loading,error } = useFetchData();

  const { didPlayerTeamWin,aggregatedPlayerStats } = useFilters(matches,players);

  const playerData = players.find(player => player._id === playerId);
  const playerStats = usePlayerPerformance(playerId,matches,didPlayerTeamWin);
  const playerAggregatedStats = aggregatedPlayerStats.find(player => player._id === playerId);

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
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" align="left" sx={{ fontFamily: 'Coolvetica',color: '#e7552b',fontSize: '18px' }}>
          {getPossessiveForm(playerData?.name)} Dashboard
        </Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          {playerAggregatedStats && (
            <>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Games Played" value={playerAggregatedStats.gamesPlayed} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Wins" value={playerAggregatedStats.wins} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Losses" value={playerAggregatedStats.losses} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Winning Percentage" value={`${playerAggregatedStats.winningPercentage}%`} />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <StatCard title="Point Differential" value={playerAggregatedStats.pointDifferential} />
              </Grid>
            </>
          )}
        </Grid>
        <Box mt={4}>
          {playerStats && (
            <LineChart
              data={playerStats.performanceOverTime}
              dataKey="winningPercentage"
              title="Winning Percentage Over Time"
              strokeColor="#e7552b"
              displayName="Winning Percentage"
            />
          )}
        </Box>
      </Box>
      <Footer />
    </div>
  );
};

export default PlayerDashboard;

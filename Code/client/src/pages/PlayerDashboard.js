// src/components/PlayerDashboard.js

import React,{ useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Grid,Typography,Container,Box } from '@mui/material';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LineChart from '../charts/LineChart';
import useFetchData from '../hooks/useFetchData';
import AuthContext from '../context/AuthContext';
import { getPossessiveForm } from '../utils/utils';
import useFilters from '../hooks/useFilters';
import usePlayerPerformance from '../hooks/usePlayerPerformance';

const PlayerDashboard = () => {
  const { auth } = useContext(AuthContext);
  const { playerId } = useParams();
  const { matches,players,loading,error } = useFetchData();

  const { didPlayerTeamWin } = useFilters();
  const playerData = players.find(player => player._id === playerId);

  const playerStats = usePlayerPerformance(playerId,matches,didPlayerTeamWin);

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error loading player data.</div>;

  if(!auth.user || auth.user.role !== 'admin') {
    return (
      <div className="player-dashboard">
        <NavBar />
        <Container>
          <Box my={4}>
            <Typography variant="h4" align="center">
              New and exciting things coming soon!
            </Typography>
          </Box>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className="player-dashboard">
      <NavBar />
      <Container>
        <Box my={4}>
          <Typography variant="h4" align="center">
            {getPossessiveForm(playerData?.name)} Dashboard
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {playerStats && (
              <LineChart
                data={playerStats.performanceOverTime}
                dataKey="winningPercentage"
                title="Winning Percentage Over Time"
                strokeColor="#e7552b"
                displayName="Winning Percentage"
              />
            )}
          </Grid>
          {/* Add more Grid items here for other charts and components */}
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default PlayerDashboard;

// src/components/PlayerDashboard.js

import React,{ useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Grid,Typography,Container,Box } from '@mui/material';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LineChart from '../charts/LineChart';
import StatCard from '../components/StatCard'; // Import the StatCard component
import useFetchData from '../hooks/useFetchData';
import AuthContext from '../context/AuthContext';
import { getPossessiveForm } from '../utils/utils';
import useFilters from '../hooks/useFilters';
import usePlayerPerformance from '../hooks/usePlayerPerformance';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'; // Example icon

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
            <Typography variant="h4"
              sx={{
                fontSize: '28px',
                fontFamily: 'Coolvetica',
                color: '#e7552b'
              }}
              align="center">
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
          <Typography
            variant="h4"
            sx={{
              fontSize: '28px',
              fontFamily: 'Coolvetica',
              color: '#e7552b',
              textAlign: 'left',
              paddingLeft: '16px'
            }}
          >
            {getPossessiveForm(playerData?.name)} Dashboard
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {playerStats && (
              <Box sx={{ paddingLeft: '16px' }}>
                <LineChart
                  data={playerStats.performanceOverTime}
                  dataKey="winningPercentage"
                  title="Winning Percentage Over Time"
                  strokeColor="#e7552b"
                  displayName="Winning Percentage"
                />
              </Box>
            )}
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <StatCard icon={<InsertChartOutlinedIcon />} title="Games Played" value={playerStats.totalGamesPlayed} />
          <StatCard icon={<InsertChartOutlinedIcon />} title="Wins" value={playerStats.totalWins} />
          <StatCard icon={<InsertChartOutlinedIcon />} title="Losses" value={playerStats.totalLosses} />
          <StatCard icon={<InsertChartOutlinedIcon />} title="Points For" value={playerStats.pointsFor} />
          <StatCard icon={<InsertChartOutlinedIcon />} title="Points Against" value={playerStats.pointsAgainst} />
          <StatCard icon={<InsertChartOutlinedIcon />} title="Point Differential" value={playerStats.pointDifferential} />
          <StatCard icon={<InsertChartOutlinedIcon />} title="Winning Percentage" value={`${playerStats.winningPercentage}%`} />
        </Grid>
      </Container>
      <Footer />
    </div>
  );
};

export default PlayerDashboard;

import React,{ useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Grid,Typography,Box } from '@mui/material';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LineChart from '../charts/LineChart';
import StatCard from '../components/StatCard';
import useFetchData from '../hooks/useFetchData';
import AuthContext from '../context/AuthContext';
import { getPossessiveForm,getMostPlayedWithPlayer,getLeastPlayedWithPlayer } from '../utils/utils';
import useFilters from '../hooks/useFilters';
import usePlayerPerformance from '../hooks/usePlayerPerformance';
import MostPlayedWithCard from '../components/MostPlayedWithCard';
import LeastPlayedWithCard from '../components/LeastPlayedWithCard';

const PlayerDashboard = () => {
  const { auth } = useContext(AuthContext);
  const { playerId } = useParams();
  const { matches,players,loading,error } = useFetchData();

  const { didPlayerTeamWin,aggregatedPlayerStats } = useFilters(matches,players);

  const playerData = players.find(player => player._id === playerId);
  const playerStats = usePlayerPerformance(playerId,matches,didPlayerTeamWin);
  const playerAggregatedStats = aggregatedPlayerStats.find(player => player._id === playerId);

  const { name: mostPlayedWithPlayer,gamesPlayed } = getMostPlayedWithPlayer(playerId,matches,players);
  const { name: leastPlayedWithPlayer,gamesPlayed: leastPlayedGames } = getLeastPlayedWithPlayer(playerId,matches,players);

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error loading player data.</div>;

  //if(!auth.user || auth.user.role !== 'admin') {
  //  return (
  //    <div className="player-dashboard">
  //      <NavBar />
  //      <h1>New and exciting things coming soon!</h1>
  //      <Footer />
  //    </div>
  //  );
  //}

  return (
    <div className="player-dashboard">
      <NavBar />
      <Box sx={{ padding: 1 }}>
        <Typography variant="h4" align="left" sx={{ fontFamily: 'Coolvetica',color: '#e7552b',fontSize: '38px',marginBottom: '15px' }}>
          {getPossessiveForm(playerData?.name)} Dashboard
        </Typography>
        <Grid container justifyContent="center" spacing={4}>
          {playerAggregatedStats && (
            <>
              <Grid item>
                <StatCard title="Games Played" value={playerAggregatedStats.gamesPlayed} rank={playerAggregatedStats.gamesPlayedRank} />
              </Grid>
              <Grid item>
                <StatCard title="Wins" value={playerAggregatedStats.wins} rank={playerAggregatedStats.winsRank} />
              </Grid>
              <Grid item>
                <StatCard title="Losses" value={playerAggregatedStats.losses} rank={playerAggregatedStats.lossesRank} />
              </Grid>
              <Grid item>
                <StatCard title="Winning Percentage" value={`${playerAggregatedStats.winningPercentage}%`} rank={playerAggregatedStats.winningPercentageRank} />
              </Grid>
              <Grid item>
                <StatCard title="Point Differential" value={playerAggregatedStats.pointDifferential} rank={playerAggregatedStats.pointDifferentialRank} />
              </Grid>
            </>
          )}
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {playerStats && (
              <LineChart
                data={playerStats.performanceOverTime}
                dataKey="winningPercentage"
                title="Winning Percentage Over Time"
                strokeColor="#e7552b"
                displayName="Winning Percentage"
                overallWinningPercentage={playerStats.winningPercentage}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <MostPlayedWithCard playerName={mostPlayedWithPlayer} gamesPlayed={gamesPlayed} />
              </Grid>
              <Grid item xs={6}>
                <LeastPlayedWithCard playerName={leastPlayedWithPlayer} gamesPlayed={leastPlayedGames} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <h1>More things coming soon</h1>
      </Box>
      <Footer />
    </div>
  );
};

export default PlayerDashboard;

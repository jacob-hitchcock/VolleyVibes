import React,{ useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Grid,Typography,Box } from '@mui/material';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LineChart from '../charts/LineChart';
import StatCard from '../components/StatCard';
import useFetchData from '../hooks/useFetchData';
import { getPossessiveForm,getMostPlayedWithPlayer,getLeastPlayedWithPlayer,getWinningPercentageTeammates } from '../utils/utils';
import useFilters from '../hooks/useFilters';
import usePlayerPerformance from '../hooks/usePlayerPerformance';
import MostPlayedWithCard from '../components/MostPlayedWithCard';
import LeastPlayedWithCard from '../components/LeastPlayedWithCard';
import HighestWinningPercentageTeammateCard from '../components/HighestWinningPercentageTeammateCard';
import LowestWinningPercentageTeammateCard from '../components/LowestWinningPercentageTeammateCard';
import HighestContributingTeammateCard from '../components/HighestContributingTeammateCard';
import LeastImpactfulTeammateCard from '../components/LeastImpactfulTeammateCard';
import DoughnutChartComponent from '../charts/DoughnutChartComponent';
import ChartCard from '../components/ChartCard';

const PlayerDashboard = () => {
  const { playerId } = useParams();
  const { matches,players,loading,error } = useFetchData();

  const { didPlayerTeamWin,aggregatedPlayerStats } = useFilters(matches,players);

  const playerData = players.find(player => player._id === playerId);
  const playerStats = usePlayerPerformance(playerId,matches,didPlayerTeamWin);
  const playerAggregatedStats = aggregatedPlayerStats.find(player => player._id === playerId);

  const { name: mostPlayedWithPlayer,gamesPlayed } = getMostPlayedWithPlayer(playerId,matches,players);
  const { name: leastPlayedWithPlayer,gamesPlayed: leastPlayedGames } = getLeastPlayedWithPlayer(playerId,matches,players);
  const { highestWinningPercentageTeammate,lowestWinningPercentageTeammate,highestContributingTeammate,leastImpactfulTeammate } = getWinningPercentageTeammates(playerId,matches,players);

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error loading player data.</div>;

  const winData = [
    { name: 'Grass',value: playerStats?.statsByLocation?.grass?.wins || 0 },
    { name: 'Indoor Court',value: playerStats?.statsByLocation?.indoorcourt?.wins || 0 },
    { name: 'Beach',value: playerStats?.statsByLocation?.beach?.wins || 0 },
  ];

  const lossData = [
    { name: 'Grass',value: playerStats?.statsByLocation?.grass?.losses || 0 },
    { name: 'Indoor Court',value: playerStats?.statsByLocation?.indoorcourt?.losses || 0 },
    { name: 'Beach',value: playerStats?.statsByLocation?.beach?.losses || 0 },
  ];

  return (
    <div className="player-dashboard">
      <NavBar />
      <Box sx={{ padding: 0 }}>
        <Typography variant="h4" align="left" sx={{ fontFamily: 'Coolvetica',color: '#e7552b',fontSize: '38px',marginBottom: '15px' }}>
          {getPossessiveForm(playerData?.name)} Dashboard
        </Typography>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2} alignItems="center" marginBottom="15px">
            {playerAggregatedStats && (
              <>
                <Grid item xs={6} md={2.4} marginBottom="15px">
                  <StatCard title="Games Played" value={playerAggregatedStats.gamesPlayed} rank={playerAggregatedStats.gamesPlayedRank} />
                </Grid>
                <Grid item xs={6} md={2.4} marginBottom="15px">
                  <StatCard title="Wins" value={playerAggregatedStats.wins} rank={playerAggregatedStats.winsRank} />
                </Grid>
                <Grid item xs={6} md={2.4} marginBottom="15px">
                  <StatCard title="Losses" value={playerAggregatedStats.losses} rank={playerAggregatedStats.lossesRank} />
                </Grid>
                <Grid item xs={6} md={2.4} marginBottom="15px">
                  <StatCard title="Point Differential" value={playerAggregatedStats.pointDifferential} rank={playerAggregatedStats.pointDifferentialRank} />
                </Grid>
                <Grid item xs={12} md={2.4} marginBottom="15px">
                  <StatCard title="Winning Percentage" value={`${playerAggregatedStats.winningPercentage}%`} rank={playerAggregatedStats.winningPercentageRank} />
                </Grid>
              </>
            )}
          </Grid>
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
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} md={6} marginBottom="15px">
                <MostPlayedWithCard playerName={mostPlayedWithPlayer} gamesPlayed={gamesPlayed} />
              </Grid>
              <Grid item xs={6} md={6} marginBottom="15px">
                <LeastPlayedWithCard playerName={leastPlayedWithPlayer} gamesPlayed={leastPlayedGames} />
              </Grid>
              <Grid item xs={6} md={6} marginBottom="15px">
                <HighestWinningPercentageTeammateCard playerName={highestWinningPercentageTeammate.name} winningPercentage={highestWinningPercentageTeammate.winningPercentage} gamesPlayed={highestWinningPercentageTeammate.gamesPlayed} />
              </Grid>
              <Grid item xs={6} md={6} marginBottom="15px">
                <LowestWinningPercentageTeammateCard playerName={lowestWinningPercentageTeammate.name} winningPercentage={lowestWinningPercentageTeammate.winningPercentage} gamesPlayed={lowestWinningPercentageTeammate.gamesPlayed} />
              </Grid>
              <Grid item xs={6} md={6} marginBottom="15px">
                <HighestContributingTeammateCard playerName={highestContributingTeammate.name} contributionPercentage={highestContributingTeammate.contributionPercentage} yourWins={playerAggregatedStats.wins} />
              </Grid>
              <Grid item xs={6} md={6} marginBottom="15px">
                <LeastImpactfulTeammateCard playerName={leastImpactfulTeammate.name} lossPercentage={leastImpactfulTeammate.lossPercentage} gamesPlayed={playerAggregatedStats.losses} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <ChartCard>
                  <DoughnutChartComponent data={winData} dataKey="value" title="Winning Zones" />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <ChartCard>
                  <DoughnutChartComponent data={lossData} dataKey="value" title="Loss Locations" />
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <ChartCard>
                  <h1>More things coming soon</h1>
                </ChartCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </div>
  );
};

export default PlayerDashboard;

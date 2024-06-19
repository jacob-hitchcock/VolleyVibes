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
import AnimatedChartWrapper from '../components/AnimatedChartWrapper';

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
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Grid container spacing={2} alignItems="center">
              {playerAggregatedStats && (
                <>
                  <Grid item xs={6} md={2.4}>
                    <StatCard title="Total Games Played" value={playerAggregatedStats.gamesPlayed} rank={playerAggregatedStats.gamesPlayedRank} />
                  </Grid>
                  <Grid item xs={6} md={2.4}>
                    <StatCard title="Winning Percentage" value={`${playerAggregatedStats.winningPercentage}%`} rank={playerAggregatedStats.winningPercentageRank} />
                  </Grid>
                  <Grid item xs={6} md={2.4}>
                    <StatCard title="Avg Points Scored" value={playerAggregatedStats.avgPointsPerGame} rank={playerAggregatedStats.avgPointsPerGameRank} />
                  </Grid>
                  <Grid item xs={6} md={2.4}>
                    <StatCard title="Avg Points Against" value={playerAggregatedStats.avgPointsAgainstPerGame} rank={playerAggregatedStats.avgPointsAgainstPerGameRank} />
                  </Grid>
                  <Grid item xs={12} md={2.4}>
                    <StatCard title="Avg Point Differential" value={playerAggregatedStats.avgPointDifferential} rank={playerAggregatedStats.avgPointDifferentialRank} />
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <AnimatedChartWrapper>
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
            </AnimatedChartWrapper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={4.5} alignItems="center">
              <Grid item xs={6} md={6}>
                <MostPlayedWithCard playerName={mostPlayedWithPlayer} gamesPlayed={gamesPlayed} />
              </Grid>
              <Grid item xs={6} md={6}>
                <LeastPlayedWithCard playerName={leastPlayedWithPlayer} gamesPlayed={leastPlayedGames} />
              </Grid>
              <Grid item xs={6} md={6}>
                <HighestWinningPercentageTeammateCard playerName={highestWinningPercentageTeammate.name} winningPercentage={highestWinningPercentageTeammate.winningPercentage} gamesPlayed={highestWinningPercentageTeammate.gamesPlayed} />
              </Grid>
              <Grid item xs={6} md={6}>
                <LowestWinningPercentageTeammateCard playerName={lowestWinningPercentageTeammate.name} winningPercentage={lowestWinningPercentageTeammate.winningPercentage} gamesPlayed={lowestWinningPercentageTeammate.gamesPlayed} />
              </Grid>
              <Grid item xs={6} md={6}>
                <HighestContributingTeammateCard playerName={highestContributingTeammate.name} contributionPercentage={highestContributingTeammate.contributionPercentage} yourWins={playerAggregatedStats.wins} />
              </Grid>
              <Grid item xs={6} md={6}>
                <LeastImpactfulTeammateCard playerName={leastImpactfulTeammate.name} lossPercentage={leastImpactfulTeammate.lossPercentage} gamesPlayed={playerAggregatedStats.losses} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <ChartCard>
                  <AnimatedChartWrapper>
                    <DoughnutChartComponent data={winData} dataKey="value" title="Winning Zones" />
                  </AnimatedChartWrapper>
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={4}>
                <ChartCard>
                  <AnimatedChartWrapper>
                    <DoughnutChartComponent data={lossData} dataKey="value" title="Loss Locations" />
                  </AnimatedChartWrapper>
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

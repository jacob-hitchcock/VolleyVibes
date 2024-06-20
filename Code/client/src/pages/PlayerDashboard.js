import React,{ useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Grid,Typography,Box } from '@mui/material';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LineChart from '../charts/LineChart';
import VWARChart from '../charts/VWARChart';
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
  const playerStats = usePlayerPerformance(playerId,matches,didPlayerTeamWin,aggregatedPlayerStats);
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
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <AnimatedChartWrapper>
                    <DoughnutChartComponent data={winData} dataKey="value" title="Winning Zones" />
                  </AnimatedChartWrapper>
                </ChartCard>
              </Grid>
              <Grid item xs={12} md={6}>
                <ChartCard>
                  <AnimatedChartWrapper>
                    <DoughnutChartComponent data={lossData} dataKey="value" title="Loss Locations" />
                  </AnimatedChartWrapper>
                </ChartCard>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <AnimatedChartWrapper>
                  {playerStats && (
                    <VWARChart
                      data={playerStats.performanceOverTime}
                      dataKey={['VWAR','cumulativeWins']}
                      title="VWAR Over Time"
                      strokeColor="#e7552b"
                      displayName="VWAR"
                      secondary={playerStats.cumulativeWins}
                    />
                  )}
                </AnimatedChartWrapper>
              </Grid>
              <Grid item xs={12} md={12}>
                <ChartCard>
                  <p><strong className="orange">Volleyball Wins Above Replacement (VWAR)</strong> is a custom statistical metric designed to measure a volleyball player's overall contribution to their team's success. It estimates the number of additional wins a player contributes to their team compared to a baseline replacement-level player.</p>
                  <h3>How VWAR is calculated:</h3>
                  <ul>
                    <li><strong>Winning Percentage:</strong> A player's winning percentage over time</li>
                    <li><strong>Point Differential:</strong> The difference between points scored and points conceded by a player's team</li>
                    <li><strong>Games Played:</strong> The total number of games a player has participated in</li>
                  </ul>
                  <p>These components are combined and adjusted to estimate a player's impact on their team's performance, providing a comprehensive view of their effectiveness and value.</p>
                  <h3>Key Elements Displayed:</h3>
                  <ul>
                    <li><strong className="orange">VWAR:</strong> The number of wins a player is above or below a replacement-level player. A higher VWAR indicates a greater positive influence on the team's chnaces of winning.</li>
                    <li><strong className="yellow">Total Wins:</strong> The cumulative number of wins a player has achieved over time.</li>
                    <li><strong className="brown">Estimated Baseline Total Wins:</strong> The estimated total number of wins a replacement-level player would have over the same period.</li>
                  </ul>
                  <p>By considering both winning percentage and point differential and teaming that with a dynamic calculation of the groups median winning percentage, VWAR offers a nuanced insight into a player's overall performance and value to their team, helping to highlight standout contributors and areas for improvement.</p>
                </ChartCard>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </div >
  );
};

export default PlayerDashboard;

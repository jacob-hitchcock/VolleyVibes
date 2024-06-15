// src/components/PlayerDashboard.js

import React,{ useState,useMemo } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LineChart from '../charts/LineChart';
import useFetchData from '../hooks/useFetchData'; // Adjust the path as needed

const PlayerDashboard = () => {
  const playerId = '6666738f6bb8ee4ede1edbf1';
  const { matches,players,loading } = useFetchData();
  const [error,setError] = useState(null);

  const playerData = players.find(player => player._id === playerId);

  const playerStats = useMemo(() => {
    if(!playerData || !matches.length) return null;

    const playerMatches = matches.filter(match =>
      match.teams.some(team => team.includes(playerId))
    );

    let wins = 0;
    let gamesPlayed = 0;

    const performanceOverTime = playerMatches.map(match => {
      gamesPlayed++;
      const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
      const isWinningTeam = match.scores[playerTeamIndex] > match.scores[1 - playerTeamIndex];
      if(isWinningTeam) wins++;
      const winningPercentage = (wins / gamesPlayed) * 100;

      return {
        date: match.date,
        winningPercentage: winningPercentage.toFixed(2),
      };
    });

    const totalGamesPlayed = playerMatches.length;

    const totalWins = playerMatches.filter(match => {
      const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
      const isWinningTeam = match.scores[playerTeamIndex] > match.scores[1 - playerTeamIndex];
      return isWinningTeam;
    }).length;

    const totalLosses = totalGamesPlayed - totalWins;

    const pointsFor = playerMatches.reduce((acc,match) => {
      const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
      return acc + match.scores[playerTeamIndex];
    },0);

    const pointsAgainst = playerMatches.reduce((acc,match) => {
      const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
      const opponentTeamIndex = playerTeamIndex === 0 ? 1 : 0;
      return acc + match.scores[opponentTeamIndex];
    },0);

    const pointDifferential = pointsFor - pointsAgainst;

    const winningPercentage = totalGamesPlayed ? ((totalWins / totalGamesPlayed) * 100).toFixed(2) : '0.00';

    const matchResults = playerMatches.map(match => ({
      match: match.date,
      points: match.scores[match.teams.findIndex(team => team.includes(playerId))]
    }));

    const performanceMetrics = [
      { metric: 'Games Played',value: totalGamesPlayed },
      { metric: 'Wins',value: totalWins },
      { metric: 'Losses',value: totalLosses },
      { metric: 'Points For',value: pointsFor },
      { metric: 'Points Against',value: pointsAgainst },
      { metric: 'Point Differential',value: pointDifferential },
      { metric: 'Winning Percentage',value: parseFloat(winningPercentage) }
    ];

    return { totalGamesPlayed,totalWins,totalLosses,pointsFor,pointsAgainst,pointDifferential,winningPercentage,performanceOverTime,matchResults,performanceMetrics };
  },[playerData,matches,playerId]);

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error loading player data.</div>;

  return (
    <div className="player-dashboard">
      <NavBar />
      <h1>{playerData?.name}'s Dashboard</h1>
      <div className="charts-container">
        {playerStats && <LineChart data={playerStats.performanceOverTime} />}
        {/* Add other charts as needed */}
      </div>
      <Footer />
    </div>
  );
};

export default PlayerDashboard;

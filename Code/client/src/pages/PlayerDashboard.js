// src/components/PlayerDashboard.js

import React,{ useMemo,useState,useContext } from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import LineChart from '../charts/LineChart';
import useFetchData from '../hooks/useFetchData';
import AuthContext from '../context/AuthContext'; // Adjust the path as needed
import { groupMatchesByDate,formatDate,getPossessiveForm } from '../utils/utils'; // Import utility functions
import useFilters from '../hooks/useFilters'; // Import the useFilters hook

const PlayerDashboard = () => {
  const { auth } = useContext(AuthContext);
  const { playerId } = useParams();
  const { matches,players,loading } = useFetchData();
  const [error,setError] = useState(null);

  const { didPlayerTeamWin } = useFilters(); // Get the didPlayerTeamWin function from useFilters

  const playerData = players.find(player => player._id === playerId);

  const playerStats = useMemo(() => {
    if(!playerData || !matches.length) return null;

    const playerMatches = matches.filter(match =>
      match.teams.some(team => team.includes(playerId))
    );

    // Group matches by date
    const matchesByDate = groupMatchesByDate(playerMatches);
    const totalDatesPlayed = Object.keys(matchesByDate).length;

    let cumulativeWins = 0;
    let cumulativeGamesPlayed = 0;
    const performanceOverTime = [];

    Object.keys(matchesByDate).forEach(date => {
      const dailyMatches = matchesByDate[date];
      let dailyWins = 0;
      let dailyGamesPlayed = 0;

      dailyMatches.forEach(match => {
        dailyGamesPlayed++;
        const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
        if(didPlayerTeamWin(match,playerTeamIndex)) dailyWins++;

        if(totalDatesPlayed <= 2) {
          // Recalculate after every match if the player has played on 2 or fewer dates
          cumulativeGamesPlayed++;
          cumulativeWins += didPlayerTeamWin(match,playerTeamIndex) ? 1 : 0;
          const winningPercentage = (cumulativeWins / cumulativeGamesPlayed) * 100;
          performanceOverTime.push({
            date: formatDate(match.date),
            winningPercentage: winningPercentage.toFixed(2),
          });
        }
      });

      if(totalDatesPlayed > 2) {
        // Recalculate after every date
        cumulativeGamesPlayed += dailyGamesPlayed;
        cumulativeWins += dailyWins;
        const winningPercentage = (cumulativeWins / cumulativeGamesPlayed) * 100;
        performanceOverTime.push({
          date: formatDate(date),
          winningPercentage: winningPercentage.toFixed(2),
        });
      }
    });

    const totalGamesPlayed = playerMatches.length;
    const totalWins = playerMatches.filter(match => {
      const playerTeamIndex = match.teams.findIndex(team => team.includes(playerId));
      return didPlayerTeamWin(match,playerTeamIndex);
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
  },[playerData,matches,playerId,didPlayerTeamWin]);

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
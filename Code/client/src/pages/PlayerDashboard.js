// src/components/PlayerDashboard.js

import React,{ useEffect,useState,useMemo } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import axiosInstance from '../axiosInstance';
import LineChartComponent from '../charts/LineChart';
// Import other chart components as needed

const PlayerDashboard = () => {
  const [players,setPlayers] = useState([]);
  const [selectedPlayerId,setSelectedPlayerId] = useState(null);
  const [playerData,setPlayerData] = useState(null);
  const [matches,setMatches] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const playersResponse = await axiosInstance.get('/players');
        setPlayers(playersResponse.data);
      } catch(error) {
        setError(error);
      }
    };

    fetchPlayers();
  },[]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      if(!selectedPlayerId) return;

      try {
        const playerResponse = await axiosInstance.get(`/players/${selectedPlayerId}`);
        const matchesResponse = await axiosInstance.get(`/matches`);
        setPlayerData(playerResponse.data);
        setMatches(matchesResponse.data);
        setLoading(false);
      } catch(error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchPlayerData();
  },[selectedPlayerId]);

  const playerStats = useMemo(() => {
    if(!playerData || !matches.length) return null;

    const playerMatches = matches.filter(match =>
      match.teams.some(team => team.includes(selectedPlayerId))
    );

    let wins = 0;
    let gamesPlayed = 0;

    const performanceOverTime = playerMatches.map(match => {
      gamesPlayed++;
      const playerTeamIndex = match.teams.findIndex(team => team.includes(selectedPlayerId));
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
      const playerTeamIndex = match.teams.findIndex(team => team.includes(selectedPlayerId));
      const isWinningTeam = match.scores[playerTeamIndex] > match.scores[1 - playerTeamIndex];
      return isWinningTeam;
    }).length;

    const totalLosses = totalGamesPlayed - totalWins;

    const pointsFor = playerMatches.reduce((acc,match) => {
      const playerTeamIndex = match.teams.findIndex(team => team.includes(selectedPlayerId));
      return acc + match.scores[playerTeamIndex];
    },0);

    const pointsAgainst = playerMatches.reduce((acc,match) => {
      const playerTeamIndex = match.teams.findIndex(team => team.includes(selectedPlayerId));
      const opponentTeamIndex = playerTeamIndex === 0 ? 1 : 0;
      return acc + match.scores[opponentTeamIndex];
    },0);

    const pointDifferential = pointsFor - pointsAgainst;

    const winningPercentage = totalGamesPlayed ? ((totalWins / totalGamesPlayed) * 100).toFixed(2) : '0.00';

    const matchResults = playerMatches.map(match => ({
      match: match.date,
      points: match.scores[match.teams.findIndex(team => team.includes(selectedPlayerId))]
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
  },[playerData,matches,selectedPlayerId]);

  if(loading) return <div>Loading...</div>;
  if(error) return <div>Error loading player data.</div>;

  return (
    <div className="player-dashboard">
      <NavBar />
      <h1>Player Dashboard</h1>
      <div>
        <select onChange={(e) => setSelectedPlayerId(e.target.value)} defaultValue="">
          <option value="" disabled>Select a player</option>
          {players.map(player => (
            <option key={player._id} value={player._id}>{player.name}</option>
          ))}
        </select>
      </div>
      {selectedPlayerId && playerStats && (
        <div className="charts-container">
          <LineChartComponent data={playerStats.performanceOverTime} />
          {/* Add other charts as needed */}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PlayerDashboard;

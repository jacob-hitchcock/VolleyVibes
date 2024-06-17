import { useState,useMemo } from 'react';
import { doesDateMatchFilter } from '../utils/utils';

const didPlayerTeamWin = (match,playerTeamIndex) => {
    const teamScore = Number(match.scores[playerTeamIndex]);
    const opponentScore = Number(match.scores[playerTeamIndex === 0 ? 1 : 0]);
    return teamScore > opponentScore;
};

const useFilters = (matches = [],players = [],selectedDate = '',context = 'default') => {
    // Ensure matches and players are arrays
    matches = Array.isArray(matches) ? matches : [];
    players = Array.isArray(players) ? players : [];

    // Match filters
    const [filterWinners,setFilterWinners] = useState([]);
    const [filterLosers,setFilterLosers] = useState([]);
    const [filterMatchDate,setFilterMatchDate] = useState(selectedDate);
    const [filterMatchLocation,setFilterMatchLocation] = useState('');

    // Player filters
    const [filterPlayerDate,setFilterPlayerDate] = useState('');
    const [filterPlayerLocations,setFilterPlayerLocations] = useState([]);

    // Filtered matches
    const filteredMatches = useMemo(() => {
        if(context === 'admin' && !filterMatchDate) {
            return []; // Return empty array when no date filter is selected in admin context
        }
        return matches.filter(match => {
            const matchDate = new Date(match.date);

            const winningTeamIndex = Number(match.scores[0]) > Number(match.scores[1]) ? 0 : 1;
            const winningTeam = Array.isArray(match.teams[winningTeamIndex]) ? match.teams[winningTeamIndex] : [];
            const allWinnersPresent = filterWinners.every(winner => winningTeam.includes(winner));

            const losingTeamIndex = winningTeamIndex === 0 ? 1 : 0;
            const losingTeam = Array.isArray(match.teams[losingTeamIndex]) ? match.teams[losingTeamIndex] : [];
            const allLosersPresent = filterLosers.every(loser => losingTeam.includes(loser));

            const locationMatch = !filterMatchLocation || match.location === filterMatchLocation;
            const dateMatch = !filterMatchDate || doesDateMatchFilter(matchDate,filterMatchDate);

            return (
                (!filterWinners.length || allWinnersPresent) &&
                (!filterLosers.length || allLosersPresent) &&
                dateMatch &&
                locationMatch
            );
        }).sort((a,b) => new Date(b.date) - new Date(a.date));
    },[matches,filterWinners,filterLosers,filterMatchDate,filterMatchLocation,context]);

    // Aggregated player stats with rankings
    const aggregatedPlayerStats = useMemo(() => {
        const stats = players.map(player => {
            const playerMatches = matches.filter(match =>
                Array.isArray(match.teams) &&
                match.teams.some(team => Array.isArray(team) && team.includes(player._id)) &&
                (!filterPlayerDate || doesDateMatchFilter(new Date(match.date),filterPlayerDate)) &&
                (!filterPlayerLocations.length || filterPlayerLocations.includes(match.location))
            );

            const gamesPlayed = playerMatches.length;

            const wins = playerMatches.filter(match => {
                const playerTeamIndex = match.teams.findIndex(team => Array.isArray(team) && team.includes(player._id));
                const isWinningTeam = didPlayerTeamWin(match,playerTeamIndex);
                return isWinningTeam;
            }).length;

            const losses = gamesPlayed - wins;

            const pointsFor = playerMatches.reduce((acc,match) => {
                const playerTeamIndex = match.teams.findIndex(team => Array.isArray(team) && team.includes(player._id));
                return acc + Number(match.scores[playerTeamIndex]);
            },0);

            const pointsAgainst = playerMatches.reduce((acc,match) => {
                const playerTeamIndex = match.teams.findIndex(team => Array.isArray(team) && team.includes(player._id));
                const opponentTeamIndex = playerTeamIndex === 0 ? 1 : 0;
                return acc + Number(match.scores[opponentTeamIndex]);
            },0);

            const pointDifferential = pointsFor - pointsAgainst;

            const winningPercentage = gamesPlayed ? ((wins / gamesPlayed) * 100).toFixed(3) : '0.000';

            return { ...player,gamesPlayed,wins,losses,pointsFor,pointsAgainst,pointDifferential,winningPercentage };
        });

        const calculateRank = (key) => {
            const sortedPlayers = stats
                .map((player) => ({ ...player }))
                .sort((a,b) => {
                    if(key === 'losses') {
                        return a[key] - b[key]; // Sort ascending for losses
                    }
                    return b[key] - a[key]; // Sort descending for all other keys
                });

            let rank = 1;
            for(let i = 0;i < sortedPlayers.length;i++) {
                if(i > 0 && sortedPlayers[i][key] !== sortedPlayers[i - 1][key]) {
                    rank = i + 1;
                }
                sortedPlayers[i].rank = rank;
            }

            return sortedPlayers;
        };

        const gamesPlayedRank = calculateRank('gamesPlayed');
        const winsRank = calculateRank('wins');
        const lossesRank = calculateRank('losses');
        const winningPercentageRank = calculateRank('winningPercentage');
        const pointDifferentialRank = calculateRank('pointDifferential');

        return stats.map(player => ({
            ...player,
            gamesPlayedRank: gamesPlayedRank.find(p => p._id === player._id).rank,
            winsRank: winsRank.find(p => p._id === player._id).rank,
            lossesRank: lossesRank.find(p => p._id === player._id).rank,
            winningPercentageRank: winningPercentageRank.find(p => p._id === player._id).rank,
            pointDifferentialRank: pointDifferentialRank.find(p => p._id === player._id).rank,
        }));
    },[players,matches,filterPlayerDate,filterPlayerLocations]);

    // Reset match filters
    const resetMatchFilters = () => {
        setFilterWinners([]);
        setFilterLosers([]);
        setFilterMatchDate('');
        setFilterMatchLocation('');
    };

    // Reset player filters
    const resetPlayerFilters = () => {
        setFilterPlayerDate('');
        setFilterPlayerLocations([]);
    };

    return {
        // Match filters
        filterWinners,
        setFilterWinners,
        filterLosers,
        setFilterLosers,
        filterMatchDate,
        setFilterMatchDate,
        filterMatchLocation,
        setFilterMatchLocation,
        filteredMatches,
        resetMatchFilters,

        // Player filters
        filterPlayerDate,
        setFilterPlayerDate,
        filterPlayerLocations,
        setFilterPlayerLocations,
        aggregatedPlayerStats,
        resetPlayerFilters,

        didPlayerTeamWin,
    };
};

export default useFilters;

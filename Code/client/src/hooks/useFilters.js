import { useState,useMemo } from 'react';
import { doesDateMatchFilter } from '../utils/utils';

/**
 * Returns true if the player's team won the given match.
 * Used internally by useFilters and exposed in its return value for reuse in child hooks.
 * @param {Object} match
 * @param {number} playerTeamIndex - 0 or 1
 * @returns {boolean}
 */
const didPlayerTeamWin = (match,playerTeamIndex) => {
    const teamScore = Number(match.scores[playerTeamIndex]);
    const opponentScore = Number(match.scores[playerTeamIndex === 0 ? 1 : 0]);
    return teamScore > opponentScore;
};

/**
 * Central filtering and stat aggregation hook used across HomePage, MatchManagement,
 * and AdminDashboard.
 *
 * Provides two independent filter groups:
 * - **Match filters**: filter by winner IDs, loser IDs, date, and location.
 * - **Player filters**: filter aggregated stats by date range and location.
 *
 * The `context` param changes behavior — in 'admin' mode, matches are hidden until
 * a date filter is selected (to avoid loading all matches at once in the admin view).
 *
 * `aggregatedPlayerStats` recomputes player stats live from filtered match data,
 * so stats update instantly when filters change without an API call.
 *
 * @param {Array<Object>} matches - All match documents.
 * @param {Array<Object>} players - All player documents.
 * @param {string} [selectedDate=''] - Pre-selected date filter (used by admin context).
 * @param {'default'|'admin'} [context='default'] - Changes filtering behavior.
 * @returns {Object} Filter state, setters, filtered data, and aggregated player stats.
 */
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

            const avgPointsPerGame = gamesPlayed ? (pointsFor / gamesPlayed).toFixed(2) : '0.00';

            const pointsAgainst = playerMatches.reduce((acc,match) => {
                const playerTeamIndex = match.teams.findIndex(team => Array.isArray(team) && team.includes(player._id));
                const opponentTeamIndex = playerTeamIndex === 0 ? 1 : 0;
                return acc + Number(match.scores[opponentTeamIndex]);
            },0);

            const avgPointsAgainstPerGame = gamesPlayed ? (pointsAgainst / gamesPlayed).toFixed(2) : '0.00';

            const pointDifferential = pointsFor - pointsAgainst;
            const avgPointDifferential = gamesPlayed ? ((pointsFor - pointsAgainst) / gamesPlayed).toFixed(2) : '0.00';

            const winningPercentage = gamesPlayed ? ((wins / gamesPlayed) * 100).toFixed(3) : '0.000';

            // Last-10 record: always uses all matches (ignores active filters) so the
            // value reflects the player's true 10 most-recent games regardless of what
            // the user has filtered the leaderboard to.
            const allPlayerMatches = matches
                .filter(match =>
                    Array.isArray(match.teams) &&
                    match.teams.some(team => Array.isArray(team) && team.includes(player._id))
                )
                .sort((a,b) => new Date(b.date) - new Date(a.date) || String(b._id).localeCompare(String(a._id)))
                .slice(0,10);

            let last10Wins = 0;
            let last10Losses = 0;
            for(const match of allPlayerMatches) {
                const playerTeamIndex = match.teams.findIndex(team => Array.isArray(team) && team.includes(player._id));
                const playerScore = Number(match.scores[playerTeamIndex]);
                const opponentScore = Number(match.scores[playerTeamIndex === 0 ? 1 : 0]);
                if(playerScore > opponentScore) last10Wins++;
                else last10Losses++;
            }

            const last10 = allPlayerMatches.length > 0
                ? { wins: last10Wins,losses: last10Losses,record: `${last10Wins}-${last10Losses}` }
                : null;

            return { ...player,gamesPlayed,wins,losses,pointsFor,avgPointsPerGame,pointsAgainst,avgPointsAgainstPerGame,pointDifferential,avgPointDifferential,winningPercentage,last10 };
        });

        const calculateRank = (key) => {
            const sortedPlayers = stats
                .map((player) => ({ ...player }))
                .sort((a,b) => {
                    if(key === 'avgPointsAgainstPerGame') {
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
        const avgPointDifferentialRank = calculateRank('avgPointDifferential');
        const avgPointsPerGameRank = calculateRank('avgPointsPerGame');
        const avgPointsAgainstPerGameRank = calculateRank('avgPointsAgainstPerGame');

        return stats.map(player => ({
            ...player,
            gamesPlayedRank: gamesPlayedRank.find(p => p._id === player._id).rank,
            winsRank: winsRank.find(p => p._id === player._id).rank,
            lossesRank: lossesRank.find(p => p._id === player._id).rank,
            winningPercentageRank: winningPercentageRank.find(p => p._id === player._id).rank,
            pointDifferentialRank: pointDifferentialRank.find(p => p._id === player._id).rank,
            avgPointDifferentialRank: avgPointDifferentialRank.find(p => p._id === player._id).rank,
            avgPointsPerGameRank: avgPointsPerGameRank.find(p => p._id === player._id).rank,
            avgPointsAgainstPerGameRank: avgPointsAgainstPerGameRank.find(p => p._id === player._id).rank,
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

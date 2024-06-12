import { useState,useMemo } from 'react';
import { doesDateMatchFilter,isTeamAWinner } from '../utils/utils';

const useFilters = (matches = [],players = []) => {
    // Match filters
    const [filterWinners,setFilterWinners] = useState([]);
    const [filterLosers,setFilterLosers] = useState([]);
    const [filterMatchDate,setFilterMatchDate] = useState('');
    const [filterMatchLocations,setFilterMatchLocations] = useState([]);

    // Player filters
    const [filterPlayerDate,setFilterPlayerDate] = useState('');
    const [filterPlayerLocations,setFilterPlayerLocations] = useState([]);

    // Filtered matches
    const filteredMatches = useMemo(() => {
        return matches.filter(match => {
            const matchDate = new Date(match.date);

            const winningTeam = isTeamAWinner(match) ? match.teams[0] : match.teams[1];
            const allWinnersPresent = filterWinners.every(winner => winningTeam.includes(winner));

            const losingTeam = isTeamAWinner(match) ? match.teams[1] : match.teams[0];
            const allLosersPresent = filterLosers.every(loser => losingTeam.includes(loser));

            return (
                (!filterWinners.length || allWinnersPresent) &&
                (!filterLosers.length || allLosersPresent) &&
                (!filterMatchDate || doesDateMatchFilter(matchDate,filterMatchDate)) &&
                (!filterMatchLocations.length || filterMatchLocations.includes(match.location))
            );
        }).sort((a,b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    },[matches,filterWinners,filterLosers,filterMatchDate,filterMatchLocations]);

    // Filtered players
    const filteredPlayers = useMemo(() => {
        if(!filterPlayerDate && !filterPlayerLocations.length) {
            // If no player filters are set, return all players
            return players;
        }

        return players.filter(player => {
            const playerMatches = matches.filter(match =>
                match.players && match.players.includes(player._id) && // Add check for match.players
                (!filterPlayerDate || doesDateMatchFilter(new Date(match.date),filterPlayerDate)) &&
                (!filterPlayerLocations.length || filterPlayerLocations.includes(match.location))
            );
            return playerMatches.length > 0;
        });
    },[players,matches,filterPlayerDate,filterPlayerLocations]);

    // Reset match filters
    const resetMatchFilters = () => {
        setFilterWinners([]);
        setFilterLosers([]);
        setFilterMatchDate('');
        setFilterMatchLocations([]);
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
        filterMatchLocations,
        setFilterMatchLocations,
        filteredMatches,
        resetMatchFilters,

        // Player filters
        filterPlayerDate,
        setFilterPlayerDate,
        filterPlayerLocations,
        setFilterPlayerLocations,
        filteredPlayers,
        resetPlayerFilters,

        isTeamAWinner,
    };
};

export default useFilters;

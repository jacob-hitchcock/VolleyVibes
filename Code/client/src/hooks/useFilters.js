import { useState,useMemo } from 'react';
import { doesDateMatchFilter,isTeamAWinner } from '../utils/utils';

const useFilters = (matches,players) => {
    const [filterWinners,setFilterWinners] = useState([]);
    const [filterLosers,setFilterLosers] = useState([]);
    const [filterDate,setFilterDate] = useState('');
    const [filterLocations,setFilterLocations] = useState([]);

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
                (!filterDate || doesDateMatchFilter(matchDate,filterDate)) &&
                (!filterLocations.length || filterLocations.includes(match.location))
            );
        }).sort((a,b) => new Date(b.date) - new Date(a.date)); // Sort by date descending
    },[matches,filterWinners,filterLosers,filterDate,filterLocations]);

    const resetFilters = () => {
        setFilterWinners([]);
        setFilterLosers([]);
        setFilterDate('');
        setFilterLocations([]);
    };

    return {
        filterWinners,
        setFilterWinners,
        filterLosers,
        setFilterLosers,
        filterDate,
        setFilterDate,
        filterLocations,
        setFilterLocations,
        filteredMatches,
        resetFilters,
        isTeamAWinner,
    };
};

export default useFilters;

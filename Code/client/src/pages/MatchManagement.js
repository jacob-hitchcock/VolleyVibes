import React,{ useState,useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import MatchGrid from '../components/MatchGrid';
import MatchDetailsModal from '../components/MatchDetailsModal';
import useFetchData from '../hooks/useFetchData';
import useFilters from '../hooks/useFilters';
import {
    getPlayerName,
    formatDate,
    getWinners,
    getLosers,
    groupMatchesByDate,
    isTeamAWinner
} from '../utils/utils';
import '../styles.css';

const MatchManagement = () => {
    const { matches,players,loading } = useFetchData();
    const {
        filterWinners,
        setFilterWinners,
        filterLosers,
        setFilterLosers,
        filterMatchDate,
        setFilterMatchDate,
        filteredMatches,
        resetMatchFilters,
    } = useFilters(matches,players);

    const [selectedMatch,setSelectedMatch] = useState(null);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [selectedLocations,setSelectedLocations] = useState([]); // Local state for location filter

    const availableLocations = ['Grass','Beach','Indoor Court'];

    useEffect(() => {
        console.log('Selected Locations:',selectedLocations);
        console.log('Selected Date:',filterMatchDate);
    },[selectedLocations,filterMatchDate]);

    const openModal = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
    };

    // Filter matches based on the selected date and location
    const filteredMatchesByLocationAndDate = filteredMatches.filter(match =>
        (!selectedLocations.length || selectedLocations.includes(match.location))
    );

    const matchesToShow = filterMatchDate || selectedLocations.length ? filteredMatchesByLocationAndDate : matches;

    const groupedMatches = groupMatchesByDate(matchesToShow);

    // Debug logs to check the filtering
    console.log('Filter Locations:',selectedLocations);
    console.log('Filter Date:',filterMatchDate);
    console.log('Filtered Matches:',filteredMatches);

    return (
        <div>
            <NavBar />
            <div className="match-title">Matches</div>
            <FilterBar
                context="matches"
                winners={players}
                losers={players}
                filterWinners={filterWinners}
                setFilterWinners={setFilterWinners}
                filterLosers={filterLosers}
                setFilterLosers={setFilterLosers}
                // Use local state and handler for location and date filters
                availableLocations={availableLocations}
                filterLocations={selectedLocations}
                setFilterLocations={setSelectedLocations}
                filterDate={filterMatchDate}
                setFilterDate={setFilterMatchDate}
                resetFilters={() => {
                    resetMatchFilters();
                    setSelectedLocations([]);
                    setFilterMatchDate('');
                }}
            />
            {loading ? (
                <div className="loading-indicator">Loading matches...</div>
            ) : (
                    <MatchGrid
                        groupedMatches={groupedMatches}
                        getWinners={(match) => getWinners(match,(id) => getPlayerName(id,players))}
                        getLosers={(match) => getLosers(match,(id) => getPlayerName(id,players))}
                        formatDate={formatDate}
                        openModal={openModal}
                    />
                )}
            <Footer className="footer-matches" />
            {isModalOpen && selectedMatch && (
                <MatchDetailsModal
                    className="match-management-modal"
                    selectedMatch={selectedMatch}
                    isTeamAWinner={isTeamAWinner}
                    getPlayerName={(id) => getPlayerName(id,players)}
                    formatDate={formatDate}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
};

export default MatchManagement;

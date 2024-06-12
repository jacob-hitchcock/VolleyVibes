import React,{ useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import MatchGrid from '../components/MatchGrid';
import MatchDetailsModal from '../components/MatchDetailsModal';
import useFetchData from '../hooks/useFetchData'; // Import the useFetchData hook
import useFilters from '../hooks/useFilters'; // Import the useFilters hook
import {
    getPlayerName,
    formatDate,
    getWinners,
    getLosers,
    groupMatchesByDate,
} from '../utils/utils'; // Import utility functions
import '../styles.css';

function MatchManagement() {
    const { matches,players,loading } = useFetchData(); // Remove setMatches from the hook
    const {
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
        isTeamAWinner, // Destructure isTeamAWinner from the hook
    } = useFilters(matches,players); // Destructure the filters and filteredMatches from the useFilters hook

    const [selectedMatch,setSelectedMatch] = useState(null);
    const [isModalOpen,setIsModalOpen] = useState(false);

    const availableLocations = ['Grass','Beach','Indoor Court'];

    const openModal = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
    };

    const groupedMatches = groupMatchesByDate(filteredMatches);

    return (
        <div>
            <NavBar />
            <div className="match-title">Matches</div>
            <FilterBar
                winners={players}
                losers={players}
                filterWinners={filterWinners}
                setFilterWinners={setFilterWinners}
                filterLosers={filterLosers}
                setFilterLosers={setFilterLosers}
                filterDate={filterDate}
                setFilterDate={setFilterDate}
                availableLocations={availableLocations}
                filterLocations={filterLocations}
                setFilterLocations={setFilterLocations}
                resetFilters={resetFilters}
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
            <Footer />
            {isModalOpen && selectedMatch && (
                <MatchDetailsModal
                    selectedMatch={selectedMatch}
                    isTeamAWinner={isTeamAWinner}
                    getPlayerName={(id) => getPlayerName(id,players)}
                    formatDate={formatDate}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
}

export default MatchManagement;
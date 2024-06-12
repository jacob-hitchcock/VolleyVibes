import React,{ useState } from 'react';
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
} from '../utils/utils';
import '../styles.css';

function MatchManagement() {
    const { matches,players,loading } = useFetchData();
    const {
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
        isTeamAWinner,
    } = useFilters(matches,players);

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
                context="matches"
                winners={players}
                losers={players}
                filterWinners={filterWinners}
                setFilterWinners={setFilterWinners}
                filterLosers={filterLosers}
                setFilterLosers={setFilterLosers}
                filterMatchDate={filterMatchDate}
                setFilterMatchDate={setFilterMatchDate}
                filterMatchLocations={filterMatchLocations}
                setFilterMatchLocations={setFilterMatchLocations}
                availableLocations={availableLocations}
                resetFilters={resetMatchFilters}
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
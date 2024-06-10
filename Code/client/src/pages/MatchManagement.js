import React,{ useState } from 'react';
import axios from 'axios';
import { Link,useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import FilterBar from '../components/FilterBar';
import MatchGrid from '../components/MatchGrid';
import TeamSelection from '../components/TeamSelection';
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
    const { matches,players,loading,setMatches } = useFetchData(); // Destructure setMatches from the hook
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

    const [teamA,setTeamA] = useState([]);
    const [teamB,setTeamB] = useState([]);
    const [scoreA,setScoreA] = useState('');
    const [scoreB,setScoreB] = useState('');
    const [date,setDate] = useState('');
    const [location,setLocation] = useState('');
    const [selectedMatch,setSelectedMatch] = useState(null);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const locationHook = useLocation();

    const availableLocations = ['Grass','Beach','Indoor Court'];

    const openModal = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
    };

    const handlePlayerSelection = (e,team) => {
        const { value,checked } = e.target;
        if(team === 'A') {
            setTeamA(checked ? [...teamA,value] : teamA.filter(player => player !== value));
        } else {
            setTeamB(checked ? [...teamB,value] : teamB.filter(player => player !== value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const match = {
            teams: [teamA,teamB],
            scores: [scoreA,scoreB],
            date: new Date(date).toISOString(), // Convert date to UTC
            location,
        };
        axios.post('/api/matches',match)
            .then(response => {
                setMatches([...matches,response.data]);
                setTeamA([]);
                setTeamB([]);
                setScoreA('');
                setScoreB('');
                setDate('');
                setLocation('');
            })
            .catch(error => console.error('Error adding match:',error));
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
            <form onSubmit={handleSubmit} className="bodycontent">
                <TeamSelection
                    teamA={teamA}
                    teamB={teamB}
                    players={players}
                    handlePlayerSelection={handlePlayerSelection}
                />
                <div className="match-details">
                    <input
                        type="number"
                        name="scoreA"
                        placeholder="Score Team A"
                        value={scoreA}
                        onChange={(e) => setScoreA(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        name="scoreB"
                        placeholder="Score Team B"
                        value={scoreB}
                        onChange={(e) => setScoreB(e.target.value)}
                        required
                    />
                    <select
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Location</option>
                        <option value="Grass">Grass</option>
                        <option value="Beach">Beach</option>
                        <option value="Indoor Court">Indoor Court</option>
                    </select>
                    <input
                        type="date"
                        name="date"
                        placeholder="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <button type="submit">Add Match</button>
                </div>
            </form>
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

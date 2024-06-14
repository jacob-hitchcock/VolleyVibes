import React,{ useState,useEffect } from 'react';
import axiosInstance from '../axiosInstance';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import ManagePlayers from '../components/ManagePlayers';
import LogoutButton from '../components/LogoutButton';
import AddMatch from '../components/AddMatch';
import ReturnToTop from '../components/ReturnToTop';
import FilterBar from '../components/FilterBar';
import MatchGrid from '../components/MatchGrid';
import MatchDetailsModal from '../components/MatchDetailsModal';
import useFetchData from '../hooks/useFetchData';
import useFilters from '../hooks/useFilters';
import {
    groupMatchesByDate,
    formatDate,
    getWinners,
    getLosers,
    getPlayerName,
    isTeamAWinner,
} from '../utils/utils';
import '../styles.css';

const AdminDashboard = () => {
    const { matches,players,loading,setMatches,setPlayers } = useFetchData();
    const [selectedMatch,setSelectedMatch] = useState(null);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [isEditing,setIsEditing] = useState(false);

    const [selectedDate,setSelectedDate] = useState('');
    const {
        filterMatchDate,
        setFilterMatchDate,
        filteredMatches,
    } = useFilters(matches,players,selectedDate);

    useEffect(() => {
        console.log('Selected Date:',filterMatchDate);
    },[filterMatchDate]);

    const handleEdit = (match) => {
        setSelectedMatch(match);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleDelete = async (matchId) => {
        if(window.confirm('Are you sure you want to delete this match?')) {
            try {
                await axiosInstance.delete(`/matches/${matchId}`);
                setMatches(matches.filter((match) => match._id !== matchId));
            } catch(error) {
                console.error('Error deleting match:',error);
            }
        }
    };

    const handleUpdate = async (matchId,updatedMatch) => {
        try {
            const response = await axiosInstance.put(`/matches/${matchId}`,updatedMatch);
            setMatches(matches.map((match) => (match._id === matchId ? response.data : match)));
            setIsModalOpen(false);
            setSelectedMatch(null);
            setIsEditing(false);
        } catch(error) {
            console.error('Error updating match:',error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
        setIsEditing(false);
    };

    const groupedMatches = groupMatchesByDate(filteredMatches);

    return (
        <div className="dashboard-layout admin-dashboard">
            <NavBar />
            <div className="admin-title">Admin Dashboard</div>
            <div className="dashboard-container">
                <Sidebar className="sidebar-hidden-mobile" />
                <div className="dashboard-content">
                    <div className="dashboard-card section">
                        <h1>Hi Jacob👋 🏐</h1>
                        <LogoutButton />
                    </div>
                    <div id="add-match" className="dashboard-card section">
                        <AddMatch matches={matches} setMatches={setMatches} players={players} />
                    </div>
                    <div id="match-management" className="dashboard-card section">
                        <FilterBar
                            context="adminMatches"
                            filterMatchDate={filterMatchDate}
                            setFilterMatchDate={setFilterMatchDate}
                            resetFilters={() => {
                                setFilterMatchDate('');
                                setSelectedDate('');
                                setMatches([]);
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
                                    openModal={handleEdit}
                                    handleEdit={handleEdit}
                                    handleDelete={handleDelete}
                                    isAdmin={true}
                                />
                            )}
                        {isModalOpen && selectedMatch && (
                            <MatchDetailsModal
                                className="admin-dashboard-modal"
                                selectedMatch={selectedMatch}
                                isTeamAWinner={isTeamAWinner}
                                getPlayerName={(id) => getPlayerName(id,players)}
                                formatDate={formatDate}
                                closeModal={closeModal}
                                handleUpdate={handleUpdate}
                                isAdmin={true}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                players={players}
                            />
                        )}
                    </div>
                    <div id="manage-players" className="dashboard-card section">
                        <ManagePlayers players={players} setPlayers={setPlayers} loading={loading} />
                    </div>
                </div>
            </div>
            <ReturnToTop />
        </div>
    );
};

export default AdminDashboard;

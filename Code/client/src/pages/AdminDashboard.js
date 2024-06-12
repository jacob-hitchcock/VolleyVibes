import React from 'react';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import ManagePlayers from '../components/ManagePlayers';
import AddMatch from '../components/AddMatch';
import ReturnToTop from '../components/ReturnToTop'; // Import the ReturnToTop component
import useFetchData from '../hooks/useFetchData';
import '../styles.css'; // Ensure you import your styles

const AdminDashboard = () => {
    const { matches,players,setPlayers,setMatches,loading } = useFetchData();

    return (
        <div className="dashboard-layout admin-dashboard">
            <NavBar />
            <div className="admin-title">Admin Dashboard</div>
            <div className="dashboard-container">
                <Sidebar />
                <div className="dashboard-content">
                    <div id="add-match" className="dashboard-card section">
                        <AddMatch matches={matches} setMatches={setMatches} players={players} />
                    </div>
                    <div id="manage-players" className="dashboard-card section">
                        <ManagePlayers players={players} setPlayers={setPlayers} loading={loading} />
                    </div>
                    {/* Add more sections as needed */}
                </div>
            </div>
            <ReturnToTop /> {/* Add the ReturnToTop component */}
        </div>
    );
};

export default AdminDashboard;
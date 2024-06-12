import React from 'react';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import ManagePlayers from '../components/ManagePlayers';
import AddMatch from '../components/AddMatch';
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
                    <div className="dashboard-card">
                        <ManagePlayers players={players} setPlayers={setPlayers} loading={loading} />
                    </div>
                    <div className="dashboard-card">
                        <AddMatch matches={matches} setMatches={setMatches} players={players} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
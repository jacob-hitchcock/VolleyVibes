// src/pages/AdminDashboard.js
import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import ManagePlayers from '../components/ManagePlayers';
import AddMatch from '../components/AddMatch';
import useFetchData from '../hooks/useFetchData';

const ProtectedComponent = () => {
    const { matches,players,setPlayers,setMatches,loading } = useFetchData();

    return (
        <DashboardLayout isAdmin={true}>
            <div className="dashboard-card">
                <ManagePlayers players={players} setPlayers={setPlayers} loading={loading} />
            </div>
            <div className="dashboard-card">
                <AddMatch matches={matches} setMatches={setMatches} players={players} />
            </div>
        </DashboardLayout>
    );
};

export default ProtectedComponent;

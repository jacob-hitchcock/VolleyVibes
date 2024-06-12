// src/layouts/DashboardLayout.js
import React from 'react';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import '../styles.css'; // Ensure you import your styles

const DashboardLayout = ({ children,isAdmin }) => {
    return (
        <div className={`dashboard-layout ${isAdmin ? 'admin-dashboard' : ''}`}>
            <NavBar />
            <div className="admin-title">Admin Dashboard</div>
            <div className="dashboard-container">
                <Sidebar />
                <div className="dashboard-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
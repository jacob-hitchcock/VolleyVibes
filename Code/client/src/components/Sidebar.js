// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css'; // Ensure you import your styles

const Sidebar = () => {
    return (
        <div className="sidebar">
            <nav>
                <ul>
                    <li><Link to="/admin/manage-players">Manage Players</Link></li>
                    <li><Link to="/admin/add-match">Add Match</Link></li>
                    {/* Add more links as needed */}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;

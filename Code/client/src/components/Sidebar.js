import React from 'react';
import LogoutButton from '../components/LogoutButton';
import '../styles.css'; // Ensure you import your styles

const Sidebar = () => {
    return (
        <div className="sidebar">
            <nav>
                <ul className="sidebar-links">
                    <li><a href="#add-match">Add Match</a></li>
                    <li><a href="#match-management">Manage Matches</a></li>
                    <li><a href="#manage-players">Manage Players</a></li>
                    <LogoutButton />
                    {/* Add more links as needed */}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
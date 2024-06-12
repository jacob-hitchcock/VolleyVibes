import React from 'react';
import '../styles.css'; // Ensure you import your styles

const Sidebar = () => {
    return (
        <div className="sidebar">
            <nav>
                <ul>
                    <li><a href="#add-match">Add Match</a></li>
                    <li><a href="#manage-players">Manage Players</a></li>
                    {/* Add more links as needed */}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
// src/pages/UserProfile.js
import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import '../styles.css';

function UserProfile() {
    const location = useLocation();

    // Example user profile, normally you would fetch this data from the server
    const user = {
        name: 'John Doe',
        age: 25,
        gender: 'Male',
        email: 'john.doe@example.com',
    };

    return (
        <div>
            <header className="header">
                <nav className="nav-left">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
                </nav>
                <div className="title-container">
                    <img src="/images/VolleyVibe.png" alt="VolleyVibe Logo" className="logo" />
                    <div className="title">
                        <div className="volley">Volley</div>
                        <div className="vibe">Vibe!</div>
                    </div>
                </div>
                <nav className="nav-right">
                    <Link to="/players" className={location.pathname === '/players' ? 'active' : ''}>Players</Link>
                    <Link to="/matches" className={location.pathname === '/matches' ? 'active' : ''}>Matches</Link>
                </nav>
            </header>
            <main className="bodycontent">
                <h2>User Profile</h2>
                <p>Name: {user.name}</p>
                <p>Age: {user.age}</p>
                <p>Gender: {user.gender}</p>
                <p>Email: {user.email}</p>
            </main>
            <footer>
                <p>Contact Information | Social Media Links | Terms of Service</p>
                <img src="/images/icon1.png" alt="icon1" />
                <img src="/images/icon2.png" alt="icon2" />
            </footer>
        </div>
    );
}

export default UserProfile;

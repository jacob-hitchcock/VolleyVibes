// src/components/NavBar.js
import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import '../styles.css';

function NavBar() {
    const location = useLocation();

    return (
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
    );
}

export default NavBar;

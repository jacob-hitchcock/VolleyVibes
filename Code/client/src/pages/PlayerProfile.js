// src/pages/Contact.js
import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import '../styles.css';

function PlayerProfile() {
    return (
        <div className="contact-information">
            <NavBar />
            <h1>Player Name</h1>
            <p>Player Stats</p>
            <Footer />
        </div>
    );
}

export default PlayerProfile;

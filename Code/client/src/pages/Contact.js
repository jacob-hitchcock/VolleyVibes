// src/pages/Contact.js
import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import '../styles.css';

function Contact() {
    return (
        <div className="contact-information">
            <NavBar />
            <h1>Contact Information</h1>
            <p>Your contact information content goes here.</p>
            <Footer />
        </div>
    );
}

export default Contact;

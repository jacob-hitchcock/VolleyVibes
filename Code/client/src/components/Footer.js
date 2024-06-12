// src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <p>
                    <Link to="/contact">Contact Information</Link> |
                    <Link to="/terms-of-service">Terms of Service</Link> |
                    <Link to="/protected">Admin Dashboard</Link>
                </p>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/facebook-icon.png" alt="Facebook" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/twitter-icon.png" alt="Twitter" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src="/images/instagram-icon.png" alt="Instagram" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

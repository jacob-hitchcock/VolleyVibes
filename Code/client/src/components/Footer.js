import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>
                    <Link to="/terms-of-service">Terms of Service</Link> |
                    <Link to="/protected">Admin Dashboard</Link>
                </p>
            </div>
        </footer>
    );
}

export default Footer;
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import '../styles.css';

function Footer() {
    return (
        <Box component="footer" className="footer">
            <Container className="footer-content">
                <p><Link component={RouterLink} to="/protected" className="footer-link">Admin Dashboard</Link></p>
                <p>&copy; {new Date().getFullYear()} VolleyVibe! All rights reserved.</p>
            </Container>
        </Box>
    );
}

export default Footer;

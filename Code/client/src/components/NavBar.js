import React,{ useState } from 'react';
import { Link,useLocation } from 'react-router-dom';
import '../styles.css';

function NavBar() {
    const location = useLocation();
    const [menuOpen,setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className={`header ${menuOpen ? 'open' : ''}`}>
            <div className="title-container">
                <img src="/images/VolleyVibe.png" alt="VolleyVibe Logo" className="logo" />
                <div className="title">
                    <div className="volley">Volley</div>
                    <div className="vibe">Vibe!</div>
                </div>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                &#9776;
            </div>
            <nav className="nav-left">
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                <Link to="/combos" className={location.pathname === '/combos' ? 'active' : ''}>Combos</Link>
            </nav>
            <nav className="nav-right">
                <Link to="/milestones" className={location.pathname === '/milestones' ? 'active' : ''}>Milestones</Link>
                <Link to="/matches" className={location.pathname === '/matches' ? 'active' : ''}>Matches</Link>
            </nav>
            {menuOpen && (
                <nav className="mobile-nav">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/combos" className={location.pathname === '/combos' ? 'active' : ''}>Combos</Link>
                    <Link to="/milestones" className={location.pathname === '/milestones' ? 'active' : ''}>Milestones</Link>
                    <Link to="/matches" className={location.pathname === '/matches' ? 'active' : ''}>Matches</Link>
                </nav>
            )}
        </header>
    );
}

export default NavBar;

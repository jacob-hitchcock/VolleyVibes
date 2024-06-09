import React,{ useState,useEffect } from 'react';
import { Link,useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

function HomePage() {
    const [players,setPlayers] = useState([]);
    const [sortConfig,setSortConfig] = useState({ key: 'wins',direction: 'descending' });
    const location = useLocation();

    useEffect(() => {
        axios.get('/api/players')
            .then(response => {
                setPlayers(response.data);
            })
            .catch(error => console.error('Error fetching leaderboard:',error));
    },[]);

    const sortedPlayers = [...players].sort((a,b) => {
        if(a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if(a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const requestSort = key => {
        let direction = 'descending';
        if(sortConfig.key === key) {
            direction = sortConfig.direction === 'descending' ? 'ascending' : 'descending';
        } else if(key === 'name') {
            direction = 'ascending';
        } else if(key === 'pointsAgainst') {
            direction = 'ascending';
        }
        setSortConfig({ key,direction });
    };

    const getSortIndicator = key => {
        if(sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return '';
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
            <main>
                <h2 className="match-title">Leaderboard</h2>
                <table classname="leaderlist">
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }} onClick={() => requestSort('name')}>
                                <div className="header-content">
                                    <span className="header-text">Name</span>
                                    <span className="sort-indicator">{getSortIndicator('name')}</span>
                                </div>
                            </th>
                            <th style={{ width: '15%' }} onClick={() => requestSort('wins')}>
                                <div className="header-content">
                                    <span className="header-text">Wins</span>
                                    <span className="sort-indicator">{getSortIndicator('wins')}</span>
                                </div>
                            </th>
                            <th style={{ width: '20%' }} onClick={() => requestSort('pointsFor')}>
                                <div className="header-content">
                                    <span className="header-text">Points For</span>
                                    <span className="sort-indicator">{getSortIndicator('pointsFor')}</span>
                                </div>
                            </th>
                            <th style={{ width: '20%' }} onClick={() => requestSort('pointsAgainst')}>
                                <div className="header-content">
                                    <span className="header-text">Points Against</span>
                                    <span className="sort-indicator">{getSortIndicator('pointsAgainst')}</span>
                                </div>
                            </th>
                            <th style={{ width: '25%' }} onClick={() => requestSort('pointDifferential')}>
                                <div className="header-content">
                                    <span className="header-text">Point Differential</span>
                                    <span className="sort-indicator">{getSortIndicator('pointDifferential')}</span>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedPlayers.map(player => (
                            <tr key={player._id}>
                                <td>{player.name}</td>
                                <td>{player.wins}</td>
                                <td>{player.pointsFor}</td>
                                <td>{player.pointsAgainst}</td>
                                <td>{player.pointDifferential}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
            <footer>
                <p>Contact Information | Social Media Links | Terms of Service</p>
                <img src="/images/icon1.png" alt="icon1" />
                <img src="/images/icon2.png" alt="icon2" />
            </footer>
        </div>
    );
}

export default HomePage;

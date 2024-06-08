// src/pages/HomePage.js
import React,{ useState,useEffect } from 'react';
import { Link,useLocation } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

function HomePage() {
    const [players,setPlayers] = useState([]);
    const location = useLocation();

    useEffect(() => {
        axios.get('/api/players')
            .then(response => {
                const sortedPlayers = response.data.sort((a,b) => {
                    if(b.wins === a.wins) {
                        return b.pointDifferential - a.pointDifferential;
                    }
                    return b.wins - a.wins;
                });
                setPlayers(sortedPlayers);
            })
            .catch(error => console.error('Error fetching leaderboard:',error));
    },[]);

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
                <h2>Welcome to VolleyVibe!</h2>
                <Link to="/matches"><button>Add Match Results</button></Link>

                <h2>Leaderboard</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Wins</th>
                            <th>Points For</th>
                            <th>Points Against</th>
                            <th>Point Differential</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(player => (
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

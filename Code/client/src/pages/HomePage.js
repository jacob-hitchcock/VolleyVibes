// src/pages/HomePage.js
import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import '../styles.css';
import NavBar from '../components/NavBar';

function HomePage() {
    const [players,setPlayers] = useState([]);
    const [sortConfig,setSortConfig] = useState({ key: 'wins',direction: 'descending' });
    const [initialLoad,setInitialLoad] = useState(true); // Track initial load
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/players')
            .then(response => {
                setPlayers(response.data);
                setLoading(false);
                setInitialLoad(true); // Set to true after fetching data
                setTimeout(() => setInitialLoad(false),1000); // Reset after animation
            })
            .catch(error => console.error('Error fetching leaderboard:',error));
    },[]);

    const sortedPlayers = [...players].sort((a,b) => {
        const aLosses = a.gamesPlayed - a.wins;
        const bLosses = b.gamesPlayed - b.wins;
        const aWinningPercentage = a.gamesPlayed ? (a.wins / a.gamesPlayed).toFixed(3) : 0;
        const bWinningPercentage = b.gamesPlayed ? (b.wins / b.gamesPlayed).toFixed(3) : 0;

        if(sortConfig.key === 'losses') {
            if(aLosses < bLosses) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if(aLosses > bLosses) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        } else if(sortConfig.key === 'winningPercentage') {
            if(aWinningPercentage < bWinningPercentage) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if(aWinningPercentage > bWinningPercentage) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        } else {
            if(a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if(a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            if(sortConfig.key === 'wins' || sortConfig.key === 'pointDifferential') {
                return a.pointDifferential < b.pointDifferential ? 1 : -1;
            }
        }
        return 0;
    });

    const requestSort = key => {
        let direction = 'descending';
        if(sortConfig.key === key) {
            direction = sortConfig.direction === 'descending' ? 'ascending' : 'descending';
        } else if(key === 'winningPercentage') {
            direction = 'descending'; // Set initial direction to descending for winningPercentage
        } else if(key === 'name' || key === 'pointsAgainst' || key === 'losses') {
            direction = 'ascending';
        }
        setSortConfig({ key,direction });
    };

    const getSortIndicator = key => {
        if(sortConfig.key === key) {
            const directionClass = sortConfig.direction === 'ascending' ? 'sorted-ascending' : 'sorted-descending';
            return (
                <span className={`sort-indicator ${directionClass}`}>
                    {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                </span>
            );
        }
        return <span className="sort-indicator"></span>; // Default state
    };

    return (
        <div>
            <NavBar />
            <main>
                <h2 className="match-title">Leaderboard</h2>
                <table className="leaderlist">
                    <thead>
                        <tr>
                            <th className={sortConfig.key === 'name' ? 'sorted' : ''} onClick={() => requestSort('name')}>
                                <div className="header-content">
                                    <span className="header-text">Name</span>
                                    {getSortIndicator('name')}
                                </div>
                            </th>
                            <th className={sortConfig.key === 'gamesPlayed' ? 'sorted' : ''} onClick={() => requestSort('gamesPlayed')}>
                                <div className="header-content">
                                    <span className="header-text">Games Played</span>
                                    {getSortIndicator('gamesPlayed')}
                                </div>
                            </th>
                            <th className={sortConfig.key === 'wins' ? 'sorted' : ''} onClick={() => requestSort('wins')}>
                                <div className="header-content">
                                    <span className="header-text">Wins</span>
                                    {getSortIndicator('wins')}
                                </div>
                            </th>
                            <th className={sortConfig.key === 'losses' ? 'sorted' : ''} onClick={() => requestSort('losses')}>
                                <div className="header-content">
                                    <span className="header-text">Losses</span>
                                    {getSortIndicator('losses')}
                                </div>
                            </th>
                            <th className={sortConfig.key === 'winningPercentage' ? 'sorted' : ''} onClick={() => requestSort('winningPercentage')}>
                                <div className="header-content">
                                    <span className="header-text">Winning %</span>
                                    {getSortIndicator('winningPercentage')}
                                </div>
                            </th>
                            <th className={sortConfig.key === 'pointsFor' ? 'sorted' : ''} onClick={() => requestSort('pointsFor')}>
                                <div className="header-content">
                                    <span className="header-text">Points For</span>
                                    {getSortIndicator('pointsFor')}
                                </div>
                            </th>
                            <th className={sortConfig.key === 'pointsAgainst' ? 'sorted' : ''} onClick={() => requestSort('pointsAgainst')}>
                                <div className="header-content">
                                    <span className="header-text">Points Against</span>
                                    {getSortIndicator('pointsAgainst')}
                                </div>
                            </th>
                            <th className={sortConfig.key === 'pointDifferential' ? 'sorted' : ''} onClick={() => requestSort('pointDifferential')}>
                                <div className="header-content">
                                    <span className="header-text">Point Differential</span>
                                    {getSortIndicator('pointDifferential')}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {!loading && sortedPlayers.map((player,index) => {
                            const winningPercentage = player.gamesPlayed ? (player.wins / player.gamesPlayed).toFixed(3) : '0.000';
                            return (
                                <tr
                                    key={player._id}
                                    className={initialLoad ? "flip-in" : ""}
                                    style={initialLoad ? { animationDelay: `${index * 0.1}s` } : {}}
                                >
                                    <td>{player.name}</td>
                                    <td>{player.gamesPlayed}</td>
                                    <td>{player.wins}</td>
                                    <td>{player.gamesPlayed - player.wins}</td>
                                    <td>{winningPercentage}</td>
                                    <td>{player.pointsFor}</td>
                                    <td>{player.pointsAgainst}</td>
                                    <td>{player.pointDifferential}</td>
                                </tr>
                            );
                        })}
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

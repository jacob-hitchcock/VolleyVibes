import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { Link,useLocation } from 'react-router-dom';
import '../styles.css';

function MatchManagement() {
    const [matches,setMatches] = useState([]);
    const [players,setPlayers] = useState([]);
    const [teamA,setTeamA] = useState([]);
    const [teamB,setTeamB] = useState([]);
    const [scoreA,setScoreA] = useState('');
    const [scoreB,setScoreB] = useState('');
    const [date,setDate] = useState('');
    const [location,setLocation] = useState('');
    const [selectedMatch,setSelectedMatch] = useState(null);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const locationHook = useLocation();

    useEffect(() => {
        axios.get('/api/players')
            .then(response => setPlayers(response.data))
            .catch(error => console.error('Error fetching players:',error));

        axios.get('/api/matches')
            .then(response => setMatches(response.data))
            .catch(error => console.error('Error fetching matches:',error));
    },[]);

    const handlePlayerSelection = (e,team) => {
        const { value,checked } = e.target;
        if(team === 'A') {
            setTeamA(checked ? [...teamA,value] : teamA.filter(player => player !== value));
        } else {
            setTeamB(checked ? [...teamB,value] : teamB.filter(player => player !== value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const match = {
            teams: [teamA,teamB],
            scores: [scoreA,scoreB],
            date,
            location,
        };
        axios.post('/api/matches',match)
            .then(response => {
                setMatches([...matches,response.data]);
                setTeamA([]);
                setTeamB([]);
                setScoreA('');
                setScoreB('');
                setDate('');
                setLocation('');
            })
            .catch(error => console.error('Error adding match:',error));
    };

    const getPlayerName = (id) => {
        const player = players.find(p => p._id === id);
        return player ? player.name : '';
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric',month: 'long',day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined,options);
    };

    const getWinners = (match) => {
        return parseInt(match.scores[0]) > parseInt(match.scores[1])
            ? match.teams[0].map(id => getPlayerName(id)).join(', ')
            : match.teams[1].map(id => getPlayerName(id)).join(', ');
    };

    const getLosers = (match) => {
        return parseInt(match.scores[0]) > parseInt(match.scores[1])
            ? match.teams[1].map(id => getPlayerName(id)).join(', ')
            : match.teams[0].map(id => getPlayerName(id)).join(', ');
    };

    const openModal = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
    };

    return (
        <div>
            <header className="header">
                <nav className="nav-left">
                    <Link to="/" className={locationHook.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/profile" className={locationHook.pathname === '/profile' ? 'active' : ''}>Profile</Link>
                </nav>
                <div className="title-container">
                    <img src="/images/VolleyVibe.png" alt="VolleyVibe Logo" className="logo" />
                    <div className="title">
                        <div className="volley">Volley</div>
                        <div className="vibe">Vibe!</div>
                    </div>
                </div>
                <nav className="nav-right">
                    <Link to="/players" className={locationHook.pathname === '/players' ? 'active' : ''}>Players</Link>
                    <Link to="/matches" className={locationHook.pathname === '/matches' ? 'active' : ''}>Matches</Link>
                </nav>
            </header>
            <form onSubmit={handleSubmit} className="bodycontent">
                <div className="teams">
                    <div className="team">
                        <h3>Team A</h3>
                        {players.map(player => (
                            <div key={player._id}>
                                <input
                                    type="checkbox"
                                    value={player._id}
                                    checked={teamA.includes(player._id)}
                                    onChange={(e) => handlePlayerSelection(e,'A')}
                                    disabled={teamB.includes(player._id)}
                                    id={`teamA-${player._id}`}
                                />
                                <label htmlFor={`teamA-${player._id}`}>{player.name}</label>
                            </div>
                        ))}
                    </div>
                    <div className="team">
                        <h3>Team B</h3>
                        {players.map(player => (
                            <div key={player._id}>
                                <input
                                    type="checkbox"
                                    value={player._id}
                                    checked={teamB.includes(player._id)}
                                    onChange={(e) => handlePlayerSelection(e,'B')}
                                    disabled={teamA.includes(player._id)}
                                    id={`teamB-${player._id}`}
                                />
                                <label htmlFor={`teamB-${player._id}`}>{player.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="match-details">
                    <input
                        type="number"
                        name="scoreA"
                        placeholder="Score Team A"
                        value={scoreA}
                        onChange={(e) => setScoreA(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        name="scoreB"
                        placeholder="Score Team B"
                        value={scoreB}
                        onChange={(e) => setScoreB(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        name="date"
                        placeholder="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    />
                    <button type="submit">Add Match</button>
                </div>
            </form>
            <div className="match-grid">
                {matches.map(match => (
                    <div key={match._id} className="match-card">
                        <div>Winners: {getWinners(match)}</div>
                        <div>Losers: {getLosers(match)}</div>
                        <div>Date: {formatDate(match.date)}</div>
                        <button onClick={() => openModal(match)}>Details</button>
                    </div>
                ))}
            </div>

            {isModalOpen && selectedMatch && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Match Details</h2>
                        <p><strong>Date:</strong> {formatDate(selectedMatch.date)}</p>
                        <p><strong>Location:</strong> {selectedMatch.location}</p>
                        <p><strong>Team A:</strong> {selectedMatch.teams[0].map(id => getPlayerName(id)).join(', ')}</p>
                        <p><strong>Team B:</strong> {selectedMatch.teams[1].map(id => getPlayerName(id)).join(', ')}</p>
                        <p><strong>Score:</strong> {selectedMatch.scores[0]}:{selectedMatch.scores[1]}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MatchManagement;
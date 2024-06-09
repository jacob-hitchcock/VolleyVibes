import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { Link,useLocation } from 'react-router-dom';
import '../styles.css';

const Dropdown = ({ label,items,selectedItems,setSelectedItems,isActive }) => {
    const [isOpen,setIsOpen] = useState(false);

    const handleCheckboxChange = (e) => {
        const { value,checked } = e.target;
        setSelectedItems(prevItems =>
            checked ? [...prevItems,value] : prevItems.filter(item => item !== value)
        );
    };

    return (
        <div className={`dropdown ${isActive ? 'active' : ''}`}>
            <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
                {label} <span className="dropdown-icon">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="dropdown-content">
                    {items.sort((a,b) => a.name.localeCompare(b.name)).map(item => (
                        <label key={item._id}>
                            <input
                                type="checkbox"
                                value={item._id}
                                checked={selectedItems.includes(item._id)}
                                onChange={handleCheckboxChange}
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};


const FilterBar = ({
    winners,
    losers,
    filterWinners,
    setFilterWinners,
    filterLosers,
    setFilterLosers,
    filterDate,
    setFilterDate,
    availableLocations,
    filterLocations,
    setFilterLocations,
    resetFilters,
}) => {
    const [showFilterSummary,setShowFilterSummary] = useState(false);

    const hasActiveFilters = (filters) => filters.length > 0;
    const isDateFilterActive = filterDate !== '';

    const activeFilters = [
        ...filterWinners.map(id => winners.find(w => w._id === id)?.name),
        ...filterLosers.map(id => losers.find(l => l._id === id)?.name),
        ...(filterDate ? [`Date: ${filterDate}`] : []),
        ...filterLocations.map(location => location),
    ];

    return (
        <div className="filter-bar">
            <div className="filter-group">
                <Dropdown
                    label="Winners"
                    items={winners}
                    selectedItems={filterWinners}
                    setSelectedItems={setFilterWinners}
                    isActive={hasActiveFilters(filterWinners)} // New prop
                />
                <Dropdown
                    label="Losers"
                    items={losers}
                    selectedItems={filterLosers}
                    setSelectedItems={setFilterLosers}
                    isActive={hasActiveFilters(filterLosers)} // New prop
                />
                <div className={'loco'}>
                    <Dropdown
                        label="Locations"
                        items={availableLocations.map(location => ({ _id: location,name: location }))}
                        selectedItems={filterLocations}
                        setSelectedItems={setFilterLocations}
                        isActive={hasActiveFilters(filterLocations)} // New prop
                    />
                </div>
                <div className={`filter-date ${isDateFilterActive ? 'active' : ''}`}>
                    <input
                        id="filter-date"
                        type="date"
                        className="date-input"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                    />
                </div>
            </div>
            <div className="filter-controls">
                <button className="reset-button" onClick={resetFilters}>Reset Filters</button>
                {showFilterSummary && (
                    <div className="filter-summary">
                        {activeFilters.length > 0 ? (
                            <ul>
                                {activeFilters.map((filter,index) => (
                                    <li key={index}>{filter}</li>
                                ))}
                            </ul>
                        ) : (
                                <p>No filters applied.</p>
                            )}
                    </div>
                )}
            </div>
        </div>
    );
};



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

    const [filterWinners,setFilterWinners] = useState([]);
    const [filterLosers,setFilterLosers] = useState([]);
    const [filterDate,setFilterDate] = useState('');
    const [filterLocations,setFilterLocations] = useState([]);

    const availableLocations = ['Grass','Beach','Indoor Court'];

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

    const isTeamAWinner = (match) => parseInt(match.scores[0]) > parseInt(match.scores[1]);

    const doesDateMatchFilter = (matchDate,filterDate) => {
        const matchYear = matchDate.getFullYear().toString();
        const matchMonth = (matchDate.getMonth() + 1).toString().padStart(2,'0');
        const matchDay = matchDate.getDate().toString().padStart(2,'0');
        const matchFullDate = `${matchYear}-${matchMonth}-${matchDay}`;

        return (
            filterDate === matchYear ||
            filterDate === `${matchYear}-${matchMonth}` ||
            filterDate === matchFullDate
        );
    };

    const filteredMatches = matches.filter(match => {
        const matchDate = new Date(match.date);
        const matchLocation = match.location.toLowerCase(); // Ensure case insensitivity

        const winningTeam = parseInt(match.scores[0]) > parseInt(match.scores[1]) ? match.teams[0] : match.teams[1];
        const allWinnersPresent = filterWinners.every(winner => winningTeam.includes(winner));

        const losingTeam = parseInt(match.scores[0]) > parseInt(match.scores[1]) ? match.teams[1] : match.teams[0];
        const allLosersPresent = filterLosers.every(loser => losingTeam.includes(loser));

        return (
            (!filterWinners.length || allWinnersPresent) &&
            (!filterLosers.length || allLosersPresent) &&
            (!filterDate || doesDateMatchFilter(matchDate,filterDate)) &&
            (!filterLocations.length || filterLocations.includes(match.location))
        );
    });

    const toggleLocationFilter = (location) => {
        setFilterLocations(prevFilters =>
            prevFilters.includes(location)
                ? prevFilters.filter(loc => loc !== location)
                : [...prevFilters,location]
        );
    };

    const resetFilters = () => {
        setFilterWinners([]);
        setFilterLosers([]);
        setFilterDate('');
        setFilterLocations([]);
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
            <div className="match-title">Matches</div>
            <FilterBar
                winners={players}
                losers={players}
                filterWinners={filterWinners}
                setFilterWinners={setFilterWinners}
                filterLosers={filterLosers}
                setFilterLosers={setFilterLosers}
                filterDate={filterDate}
                setFilterDate={setFilterDate}
                availableLocations={availableLocations}
                filterLocations={filterLocations}
                setFilterLocations={setFilterLocations} // Ensure this is passed correctly
                resetFilters={resetFilters}
            />
            <div className="match-grid">
                {filteredMatches.map(match => (
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
                        <h2 className="modal-title">Match Details</h2>
                        <div className="modal-body">
                            <div className={`team-column ${isTeamAWinner(selectedMatch) ? 'winner' : 'loser'}`}>
                                <h3>Team A</h3>
                                <p className={`score ${isTeamAWinner(selectedMatch) ? 'winning-score' : 'losing-score'}`}>
                                    {selectedMatch.scores[0]}
                                </p>
                                <p>{selectedMatch.teams[0].map(id => getPlayerName(id)).join(', ')}</p>
                            </div>
                            <div className={`triangle ${isTeamAWinner(selectedMatch) ? 'triangle-left' : 'triangle-right'}`}></div>
                            <div className={`team-column ${!isTeamAWinner(selectedMatch) ? 'winner' : 'loser'}`}>
                                <h3>Team B</h3>
                                <p className={`score ${!isTeamAWinner(selectedMatch) ? 'winning-score' : 'losing-score'}`}>
                                    {selectedMatch.scores[1]}
                                </p>
                                <p>{selectedMatch.teams[1].map(id => getPlayerName(id)).join(', ')}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <p><strong>Date:</strong> {formatDate(selectedMatch.date)} <strong> | Location:</strong> {selectedMatch.location}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MatchManagement;


/*
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
                    <select
                        name="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Location</option>
                        <option value="Grass">Grass</option>
                        <option value="Beach">Beach</option>
                        <option value="Indoor Court">Indoor Court</option>
                    </select>
                    <input
                        type="date"
                        name="date"
                        placeholder="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                    <button type="submit">Add Match</button>
                </div>
            </form>
            */
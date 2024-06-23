import React,{ useState,useRef } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import useFetchData from '../hooks/useFetchData';
import useFilters from '../hooks/useFilters';
import PlayerStats from '../components/PlayerStats';
import Timeline from '../components/Timeline';
import CircularProgress from '@mui/material/CircularProgress';
import '../styles.css';

const MilestonesPage = () => {
    const { matches,players,loading,error } = useFetchData();
    const { didPlayerTeamWin,aggregatedPlayerStats } = useFilters(matches,players);
    const [milestones,setMilestones] = useState([]);
    const [selectedPlayer,setSelectedPlayer] = useState('All');
    const addedMilestonesRef = useRef(new Set());

    const handleMilestone = (milestone) => {
        if(!addedMilestonesRef.current.has(milestone.player + milestone.title)) {
            console.log(`Adding milestone: ${milestone.title} for ${milestone.player}`);
            setMilestones((prevMilestones) => [...prevMilestones,milestone].sort((a,b) => new Date(b.date) - new Date(a.date)));
            addedMilestonesRef.current.add(milestone.player + milestone.title);
        }
    };

    const filteredMilestones = selectedPlayer === 'All'
        ? milestones
        : milestones.filter(milestone => milestone.player === selectedPlayer);

    return (
        <div>
            <NavBar />
            <div className="milestones-page">
                <h1>League Milestones</h1>
                {loading ? (
                    <div className="loading-indicator">
                        <CircularProgress sx={{ color: '#E7552B' }} />
                        <p>Loading milestones...</p>
                    </div>
                ) : (
                        <div>
                            <label htmlFor="player-select">Filter by Player: </label>
                            <select id="player-select" value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
                                <option value="All">All</option>
                                {players.map((player) => (
                                    <option key={player._id} value={player.name}>{player.name}</option>
                                ))}
                            </select>
                            <ul>
                                {players.map((player) => (
                                    <PlayerStats
                                        key={player._id}
                                        player={player}
                                        matches={matches}
                                        didPlayerTeamWin={didPlayerTeamWin}
                                        aggregatedPlayerStats={aggregatedPlayerStats}
                                        onMilestone={handleMilestone}
                                    />
                                ))}
                            </ul>
                            {filteredMilestones.length > 0 ? (
                                <Timeline milestones={filteredMilestones} />
                            ) : (
                                    <p>No milestones yet.</p>
                                )}
                        </div>
                    )}
            </div>
            <Footer />
        </div>
    );
};

export default MilestonesPage;

import React,{ useState,useRef,useMemo } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import useFetchData from '../hooks/useFetchData';
import useFilters from '../hooks/useFilters';
import PlayerStats from '../components/PlayerStats';
import Timeline from '../components/Timeline';
import CircularProgress from '@mui/material/CircularProgress';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import '../styles.css';

const MilestonesPage = () => {
    const { matches,players,loading,error } = useFetchData(); // Include `error`
    const { didPlayerTeamWin,aggregatedPlayerStats } = useFilters(matches,players);
    const [milestones,setMilestones] = useState([]);
    const [selectedPlayer,setSelectedPlayer] = useState('All');
    const addedMilestonesRef = useRef(new Set());

    const sortString = (str) => {
        return str.replace(/\s/g,'').split('').sort((a,b) => a.localeCompare(b)).join('');
    };

    const handleMilestone = (milestone) => {
        const normalizedTitle = sortString(milestone.description);
        const milestoneIdentifier = `${milestone.date}-${normalizedTitle}`;
        if(!addedMilestonesRef.current.has(milestoneIdentifier)) {
            setMilestones(prevMilestones => {
                const newMilestones = [...prevMilestones,milestone];
                newMilestones.sort((a,b) => new Date(b.date) - new Date(a.date));
                return newMilestones;
            });
            addedMilestonesRef.current.add(milestoneIdentifier);
        }
    };

    const filteredMilestones = useMemo(() => {
        if(selectedPlayer === 'All') {
            return milestones;
        }
        return milestones.filter(milestone => milestone.description.includes(selectedPlayer));
    },[milestones,selectedPlayer]);

    const sortedPlayers = useMemo(() => {
        return [...players].sort((a,b) => a.name.localeCompare(b.name));
    },[players]);

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
                ) : error ? (
                    <div className="error-message">
                        <p>Error loading data: {error.message}</p>
                    </div>
                ) : (
                            <div>
                                <FormControl
                                    sx={{
                                        display: 'block',
                                        height: '56px', // Adjust height as needed
                                        mb: 2, // Margin bottom to space it out from the header
                                    }}
                                    variant="outlined"
                                    margin="normal"
                                >
                                    <InputLabel
                                        id="player-select-label"
                                        sx={{
                                            fontFamily: 'coolvetica',
                                            '&.Mui-focused': {
                                                color: '#e7552b', // Label color when focused/active
                                            },
                                        }}
                                    >
                                        Filter By Player
                            </InputLabel>
                                    <NativeSelect
                                        labelId="player-select-label"
                                        id="player-select"
                                        value={selectedPlayer}
                                        onChange={(e) => setSelectedPlayer(e.target.value)}
                                        label="Filter by Player"
                                        sx={{
                                            width: '200px',
                                            fontFamily: 'coolvetica',
                                            '& .MuiNativeSelect-root': {
                                                borderColor: 'gray', // Default border color
                                            },
                                            '&:hover .MuiNativeSelect-root': {
                                                borderColor: '#e7552b', // Border color on hover
                                            },
                                            '&.Mui-focused .MuiNativeSelect-root': {
                                                borderColor: '#e7552b', // Border color when focused
                                            },
                                            '& .MuiNativeSelect-select': {
                                                borderColor: '#e7552b',
                                            },
                                            '& .MuiNativeSelect-icon': {
                                                color: '#e7552b', // Color of the dropdown arrow icon
                                            },
                                        }}
                                    >
                                        <option
                                            value="All"
                                            sx={{
                                                fontFamily: 'coolvetica',
                                                '&.Mui-focused': {
                                                    backgroundColor: '#ff7043', // Background color when focused
                                                },
                                                '&.Mui-selected.Mui-focusVisible': {
                                                    backgroundColor: '#ff7043' // Set the highlight color to white on the first menu item when the menu opens
                                                },
                                            }}
                                        >
                                            All
                                </option>
                                        {sortedPlayers.map((player) => (
                                            <option
                                                key={player._id}
                                                value={player.name}
                                                sx={{
                                                    fontFamily: 'coolvetica',
                                                    '&.Mui-focused': {
                                                        backgroundColor: '#ff7043', // Background color when focused
                                                    },
                                                    '&.Mui-selected': {
                                                        backgroundColor: '#ff7043', // Background color
                                                        '&:hover': {
                                                            backgroundColor: '#ff7043', // Keep background color on hover when selected
                                                        },
                                                    },
                                                }}
                                            >
                                                {player.name}
                                            </option>
                                        ))}
                                    </NativeSelect>
                                </FormControl>
                                <ul>
                                    {players.map((player) => (
                                        <PlayerStats
                                            key={player._id}
                                            player={player}
                                            matches={matches}
                                            didPlayerTeamWin={didPlayerTeamWin}
                                            aggregatedPlayerStats={aggregatedPlayerStats}
                                            onMilestone={handleMilestone}
                                            players={players} // Pass the players array here
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

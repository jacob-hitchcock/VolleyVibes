import React,{ useState,useRef } from 'react';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import useFetchData from '../hooks/useFetchData';
import useFilters from '../hooks/useFilters';
import PlayerStats from '../components/PlayerStats';
import Timeline from '../components/Timeline';
import CircularProgress from '@mui/material/CircularProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
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
                                <Select
                                    labelId="player-select-label"
                                    id="player-select"
                                    value={selectedPlayer}
                                    onChange={(e) => setSelectedPlayer(e.target.value)}
                                    label="Filter by Player"
                                    MenuProps={{ PaperProps: { sx: { maxHeight: 400,minWidth: 200 } } }}
                                    sx={{
                                        width: '200px',
                                        fontFamily: 'coolvetica',
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'gray',
                                        },
                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: 'black',
                                        },
                                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#e7552b',
                                        },
                                        '&.Mui-selected': {
                                            backgroundColor: '#ff7043', // Background colo
                                            '&:hover': {
                                                backgroundColor: '#ff7043', // Keep background color on hover when selected
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="All" sx={{
                                        fontFamily: 'coolvetica',
                                        '&.Mui-focused': {
                                            backgroundColor: '#ff7043', // Background color when focused
                                        },
                                        '&.Mui-selected.Mui-focusVisible': {
                                            backgroundColor: '#ff7043' //Set the highlight color to white on the first menu item when the menu opens
                                        }
                                    }}>All</MenuItem>
                                    {players.map((player) => (
                                        <MenuItem key={player._id} value={player.name} sx={{
                                            fontFamily: 'coolvetica',
                                            '&.Mui-focused': {
                                                backgroundColor: '#ff7043', // Background color when focused
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#ff7043', // Background colo
                                                '&:hover': {
                                                    backgroundColor: '#ff7043', // Keep background color on hover when selected
                                                },
                                            },
                                        }}>{player.name}</MenuItem>
                                    ))}
                                </Select>
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

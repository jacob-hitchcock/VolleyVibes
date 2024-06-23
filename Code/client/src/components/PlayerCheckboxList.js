import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import '../styles.css';

const PlayerCheckboxList = ({ players,selectedPlayers,handlePlayerSelect }) => {
    const sortedPlayers = [...players].sort((a,b) => a.name.localeCompare(b.name));
    const half = Math.ceil(sortedPlayers.length / 2);
    const leftColumnPlayers = sortedPlayers.slice(0,half);
    const rightColumnPlayers = sortedPlayers.slice(half);

    const handleSelectAll = () => {
        sortedPlayers.forEach(player => {
            if(!selectedPlayers.includes(player._id)) {
                handlePlayerSelect(player._id);
            }
        });
    };

    const handleDeselectAll = () => {
        selectedPlayers.forEach(playerId => handlePlayerSelect(playerId));
    };

    return (
        <div className="players-list-container">
            <div className="players-list-columns">
                <div className="players-list-column">
                    {leftColumnPlayers.map((player) => (
                        <div key={player._id} className="player-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    value={player._id}
                                    onChange={() => handlePlayerSelect(player._id)}
                                    checked={selectedPlayers.includes(player._id)}
                                />
                                {player.name}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="players-list-column">
                    {rightColumnPlayers.map((player) => (
                        <div key={player._id} className="player-checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    value={player._id}
                                    onChange={() => handlePlayerSelect(player._id)}
                                    checked={selectedPlayers.includes(player._id)}
                                />
                                {player.name}
                            </label>
                        </div>
                    ))}
                </div>
            </div>
            <div className="players-list-actions">
                <Button
                    onClick={handleSelectAll}
                    sx={{
                        marginRight: '10px',
                        color: '#e7552b',
                        fontFamily: 'Coolvetica',
                    }}
                >
                    Select All
                </Button>
                <Button
                    onClick={handleDeselectAll}
                    sx={{
                        color: '#e7552b',
                        fontFamily: 'Coolvetica',
                    }}
                >
                    Deselect All
                </Button>
            </div>
        </div>
    );
};

PlayerCheckboxList.propTypes = {
    players: PropTypes.array.isRequired,
    selectedPlayers: PropTypes.array.isRequired,
    handlePlayerSelect: PropTypes.func.isRequired,
};

export default PlayerCheckboxList;

import React from 'react';
import { Button } from '@mui/material';

const PlayerCheckboxList = ({ players,selectedPlayers,handlePlayerSelect }) => {
    const handleSelectAll = () => {
        players.forEach(player => {
            if(!selectedPlayers.includes(player._id)) {
                handlePlayerSelect(player._id);
            }
        });
    };

    const handleDeselectAll = () => {
        selectedPlayers.forEach(playerId => handlePlayerSelect(playerId));
    };
    return (
        <div className='player-list-container'>
            <div className="players-list">
                {players.map((player) => (
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
            <div className="player-checkbox-actions">
                <Button onClick={handleSelectAll} sx={{
                    marginRight: '10px',color: '#e7552b',fontFamily: 'Coolvetica',
                }}>Select All</Button>
                <Button onClick={handleDeselectAll} sx={{
                    color: '#e7552b',fontFamily: 'Coolvetica',
                }}>Deselect All</Button>
            </div>
        </div>
    );
}

export default PlayerCheckboxList;
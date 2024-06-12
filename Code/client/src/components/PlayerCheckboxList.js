import React from 'react';

const PlayerCheckboxList = ({ players,selectedPlayers,handlePlayerSelect }) => (
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
);

export default PlayerCheckboxList;
import React from 'react';
import PropTypes from 'prop-types';

const PlayerNumberList = ({ playerNumbers }) => {
    return (
        <div className="player-numbers">
            {playerNumbers.length > 0 && (
                <div>
                    <h3>Selected Players and their Numbers</h3>
                    <ul>
                        {playerNumbers
                            .sort((a,b) => a.number - b.number)
                            .map(player => (
                                <li key={player.id}>
                                    {player.number}. {player.name}
                                </li>
                            ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

PlayerNumberList.propTypes = {
    playerNumbers: PropTypes.array.isRequired,
};

export default PlayerNumberList;

import React from 'react';
import '../styles.css';

const MatchupCard = ({ matchup,index,toggleCompleted,isGenerated }) => (
    <div
        className={`match-card ${matchup.completed ? 'completed' : ''}`}
        onClick={() => toggleCompleted(index)}
    >
        <div>
            <strong>{isGenerated ? `Selected Matchup ${index + 1}` : `Matchup ${index + 1}`}:</strong>
        </div>
        <div>
            <strong>Team A:</strong> {matchup.teamA.map(player => `${player.number}. ${player.name}`).join(', ')}
        </div>
        <div>
            <strong>Team B:</strong> {matchup.teamB.map(player => `${player.number}. ${player.name}`).join(', ')}
        </div>
    </div>
);

export default MatchupCard;
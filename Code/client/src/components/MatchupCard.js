import React from 'react';
import '../styles.css';

const MatchupCard = ({
    matchup,
    index,
    toggleCompleted,
    isGenerated,
    isAdmin = false,
    handleEdit,
    handleDelete
}) => (
    <div
        className={`match-card ${matchup.completed ? 'completed' : ''}`}
        onClick={!isAdmin ? () => toggleCompleted(index) : undefined}
    >
        <div>
            <strong>{isGenerated ? `Selected Matchup ${index + 1}` : `Matchup ${index + 1}`}:</strong>
        </div>
        <div>
            <strong className="orange">Team A:</strong> {matchup.teamA.map(player => `${player.number}. ${player.name}`).join(', ')}
        </div>
        <div>
            <strong className="orange">Team B:</strong> {matchup.teamB.map(player => `${player.number}. ${player.name}`).join(', ')}
        </div>
        {isAdmin && (
            <div className="admin-controls">
                <button onClick={(e) => { e.stopPropagation(); handleEdit(matchup); }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(matchup.id); }}>Delete</button>
            </div>
        )}
    </div>
);

//test comment

export default MatchupCard;
import React from 'react';
import '../styles.css';
import Divider from '@mui/material/Divider';


const MatchupCard = ({
    matchup,
    index,
    toggleCompleted,
    isGenerated,
    isAdmin = false,
    handleEdit,
    handleDelete,
    prediction // New prop
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
        <Divider />
        {prediction && (
            <div className="prediction" style={{ marginTop: '5px' }}>
                <strong>Predicted Winner:</strong>
                <p>Team A Probability: {(prediction.teamAProbability * 100).toFixed(2)}%</p>
                <p>Team B Probability: {(prediction.teamBProbability * 100).toFixed(2)}%</p>
                <p>Predicted Score - Team A: {prediction.teamAScore}, Team B: {prediction.teamBScore}</p>
            </div>
        )}
        {isAdmin && (
            <div className="admin-controls">
                <button onClick={(e) => { e.stopPropagation(); handleEdit(matchup); }}>Edit</button>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(matchup.id); }}>Delete</button>
            </div>
        )}
    </div>
);

export default MatchupCard;

import React from 'react';
import '../styles.css';
import Button from '@mui/material/Button';

const MatchCard = ({ match,getWinners,getLosers,formatDate,openModal,handleEdit,handleDelete,isAdmin }) => {
    const scoreA = match.scores[0];
    const scoreB = match.scores[1];
    const higherScore = Math.max(scoreA,scoreB);
    const lowerScore = Math.min(scoreA,scoreB);
    const scoreDifference = higherScore - lowerScore;

    return (
        <div className="match-card">
            <div>Winners: {getWinners(match)}</div>
            <div>Losers: {getLosers(match)}</div>
            <div>Score: {higherScore} - {lowerScore} (± {scoreDifference})</div>
            <Button sx={{
                backgroundColor: '#E7552B',
                color: '#fff5d6',
                border: 'none',
                fontFamily: 'Coolvetica',
                textTransform: 'none',
                height: '25px',
                borderRadius: '10px',
                fontSize: '12px',
                cursor: 'pointer',
                margin: '10px 0',
                '&:hover': {
                    backgroundColor: '#e03e00',
                },
            }}
                onClick={() => openModal(match)}>Details</Button>
            {isAdmin && (
                <>
                    <button style={{ marginRight: 5 }} onClick={() => handleEdit(match)}>Edit</button>
                    <button onClick={() => handleDelete(match._id)}>Delete</button>
                </>
            )}
        </div>
    );
};

export default MatchCard;

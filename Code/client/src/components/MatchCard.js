import React from 'react';
import '../styles.css';

const MatchCard = ({ match,getWinners,getLosers,formatDate,openModal }) => {
    return (
        <div className="match-card">
            <div>Winners: {getWinners(match)}</div>
            <div>Losers: {getLosers(match)}</div>
            <div>Date: {formatDate(match.date)}</div>
            <button onClick={() => openModal(match)}>Details</button>
        </div>
    );
};

export default MatchCard;

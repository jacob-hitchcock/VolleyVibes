import React from 'react';
import '../styles.css';

const MatchCard = ({ match,getWinners,getLosers,formatDate,openModal,handleEdit,handleDelete,isAdmin }) => (
    <div className="match-card">
        <div>Winners: {getWinners(match)}</div>
        <div>Losers: {getLosers(match)}</div>
        <div>Date: {formatDate(match.date)}</div>
        <button style={{ marginRight: 5 }} onClick={() => openModal(match)}>Details</button>
        {isAdmin && (
            <>
                <button style={{ marginRight: 5 }} onClick={() => handleEdit(match)}>Edit</button>
                <button onClick={() => handleDelete(match._id)}>Delete</button>
            </>
        )}
    </div>
);

export default MatchCard;
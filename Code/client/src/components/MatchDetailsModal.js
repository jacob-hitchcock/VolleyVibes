import React,{ useState,useEffect } from 'react';
import '../styles.css';

const MatchDetailsModal = ({ selectedMatch,isTeamAWinner,getPlayerName,formatDate,closeModal }) => {
    const [isClosing,setIsClosing] = useState(false);

    // Add a function to handle closing animation
    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            closeModal();
            setIsClosing(false);
        },500); // Duration of the closing animation
    };

    return (
        <div className={`modal-background ${isClosing ? 'background-fade-out' : 'background-fade-in'}`}>
            <div className={`modal-content ${isClosing ? 'modal-zoom-out' : 'modal-zoom-in'}`}>
                <span className="close" onClick={handleClose}>&times;</span>
                <h2 className="modal-title">Match Details</h2>
                <div className="modal-body">
                    <div className={`team-column ${isTeamAWinner(selectedMatch) ? 'winner' : 'loser'}`}>
                        <h3>Team A</h3>
                        <p className={`score ${isTeamAWinner(selectedMatch) ? 'winning-score' : 'losing-score'}`}>
                            {selectedMatch.scores[0]}
                        </p>
                        <p>{selectedMatch.teams[0].map(id => getPlayerName(id)).join(', ')}</p>
                    </div>
                    <div className={`triangle ${isTeamAWinner(selectedMatch) ? 'triangle-left' : 'triangle-right'}`}></div>
                    <div className={`team-column ${!isTeamAWinner(selectedMatch) ? 'winner' : 'loser'}`}>
                        <h3>Team B</h3>
                        <p className={`score ${!isTeamAWinner(selectedMatch) ? 'winning-score' : 'losing-score'}`}>
                            {selectedMatch.scores[1]}
                        </p>
                        <p>{selectedMatch.teams[1].map(id => getPlayerName(id)).join(', ')}</p>
                    </div>
                </div>
                <div className="modal-footer">
                    <p><strong>Date:</strong> {formatDate(selectedMatch.date)} <strong> | Location:</strong> {selectedMatch.location}</p>
                </div>
            </div>
        </div>
    );
};

export default MatchDetailsModal;

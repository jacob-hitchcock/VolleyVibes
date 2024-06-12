import React,{ useState,useEffect } from 'react';
import { isTeamAWinner } from '../utils/utils';
import TeamSelection from './TeamSelection';
import '../styles.css';

const locations = ['Grass','Beach','Indoor Court'];

const MatchDetailsModal = ({
    selectedMatch,
    getPlayerName,
    formatDate,
    closeModal,
    handleUpdate,
    isAdmin,
    isEditing,
    setIsEditing,
    players
}) => {
    const [isClosing,setIsClosing] = useState(false);
    const [editableMatch,setEditableMatch] = useState({ ...selectedMatch });

    useEffect(() => {
        // Ensure teams are arrays
        if(!Array.isArray(editableMatch.teams[0])) {
            setEditableMatch(prevMatch => ({ ...prevMatch,teams: [[],...prevMatch.teams.slice(1)] }));
        }
        if(!Array.isArray(editableMatch.teams[1])) {
            setEditableMatch(prevMatch => ({ ...prevMatch,teams: [prevMatch.teams[0],[]] }));
        }
    },[editableMatch.teams]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            closeModal();
            setIsClosing(false);
        },500); // Duration of the closing animation
    };

    const handleChange = (field,value) => {
        setEditableMatch(prevMatch => ({ ...prevMatch,[field]: value }));
    };

    const handlePlayerSelection = (e,team) => {
        const playerId = e.target.value;
        const isChecked = e.target.checked;

        setEditableMatch(prevMatch => {
            const updatedTeams = [...prevMatch.teams];
            if(team === 'A') {
                if(isChecked) {
                    updatedTeams[0] = [...updatedTeams[0],playerId];
                } else {
                    updatedTeams[0] = updatedTeams[0].filter(id => id !== playerId);
                }
            } else if(team === 'B') {
                if(isChecked) {
                    updatedTeams[1] = [...updatedTeams[1],playerId];
                } else {
                    updatedTeams[1] = updatedTeams[1].filter(id => id !== playerId);
                }
            }
            return { ...prevMatch,teams: updatedTeams };
        });
    };

    const handleSave = () => {
        handleUpdate(editableMatch._id,editableMatch);
    };

    return (
        <div className={`modal-background ${isClosing ? 'background-fade-out' : 'background-fade-in'}`}>
            <div className={`modal-content ${isClosing ? 'modal-zoom-out' : 'modal-zoom-in'} ${isAdmin ? 'admin-modal' : ''}`}>
                <span className="close" onClick={handleClose}>&times;</span>
                <h2 className="modal-title">Match Details</h2>
                <div className="modal-body">
                    {isAdmin && isEditing ? (
                        <div className="bodycontent">
                            <TeamSelection
                                teamA={editableMatch.teams[0]}
                                teamB={editableMatch.teams[1]}
                                players={players}
                                handlePlayerSelection={handlePlayerSelection}
                            />
                            <div className="match-details">
                                <label htmlFor="scoreA">Team A Score:</label>
                                <input
                                    type="number"
                                    id="scoreA"
                                    value={editableMatch.scores[0]}
                                    onChange={(e) => handleChange('scores',[e.target.value,editableMatch.scores[1]])}
                                    required
                                />
                                <label htmlFor="scoreB">Team B Score:</label>
                                <input
                                    type="number"
                                    id="scoreB"
                                    value={editableMatch.scores[1]}
                                    onChange={(e) => handleChange('scores',[editableMatch.scores[0],e.target.value])}
                                    required
                                />
                                <label htmlFor="location">Location:</label>
                                <select
                                    id="location"
                                    value={editableMatch.location}
                                    onChange={(e) => handleChange('location',e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Select Location</option>
                                    {locations.map(location => (
                                        <option key={location} value={location}>{location}</option>
                                    ))}
                                </select>
                                <label htmlFor="date">Date:</label>
                                <input
                                    type="date"
                                    id="date"
                                    value={editableMatch.date.split('T')[0]}
                                    onChange={(e) => handleChange('date',e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                            <>
                                <div className={`team-column ${isTeamAWinner(editableMatch) ? 'winner' : 'loser'}`}>
                                    <h3>Team A</h3>
                                    <p className={`score ${isTeamAWinner(editableMatch) ? 'winning-score' : 'losing-score'}`}>
                                        {editableMatch.scores[0]}
                                    </p>
                                    <p>{editableMatch.teams[0].map(id => getPlayerName(id)).join(', ')}</p>
                                </div>
                                <div className={`triangle ${isTeamAWinner(editableMatch) ? 'triangle-left' : 'triangle-right'}`}></div>
                                <div className={`team-column ${!isTeamAWinner(editableMatch) ? 'winner' : 'loser'}`}>
                                    <h3>Team B</h3>
                                    <p className={`score ${!isTeamAWinner(editableMatch) ? 'winning-score' : 'losing-score'}`}>
                                        {editableMatch.scores[1]}
                                    </p>
                                    <p>{editableMatch.teams[1].map(id => getPlayerName(id)).join(', ')}</p>
                                </div>
                            </>
                        )}
                </div>
                <div className="modal-footer">
                    <p><strong>Date:</strong> {formatDate(editableMatch.date)} <strong> | Location:</strong> {editableMatch.location}</p>
                    {isAdmin && (
                        <>
                            {isEditing ? (
                                <button className="edit-button" onClick={handleSave}>Save</button>
                            ) : (
                                    <button className="edit-button" onClick={() => setIsEditing(true)}>Edit</button>
                                )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchDetailsModal;
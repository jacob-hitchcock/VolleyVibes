import React from 'react';
import '../styles.css';

const TeamSelection = ({ teamA,teamB,players,handlePlayerSelection }) => {
    return (
        <div className="teams">
            <div className="team">
                <h3>Team A</h3>
                {players.map(player => (
                    <div key={player._id}>
                        <input
                            type="checkbox"
                            value={player._id}
                            checked={teamA.includes(player._id)}
                            onChange={(e) => handlePlayerSelection(e,'A')}
                            disabled={teamB.includes(player._id)}
                            id={`teamA-${player._id}`}
                        />
                        <label htmlFor={`teamA-${player._id}`}>{player.name}</label>
                    </div>
                ))}
            </div>
            <div className="team">
                <h3>Team B</h3>
                {players.map(player => (
                    <div key={player._id}>
                        <input
                            type="checkbox"
                            value={player._id}
                            checked={teamB.includes(player._id)}
                            onChange={(e) => handlePlayerSelection(e,'B')}
                            disabled={teamA.includes(player._id)}
                            id={`teamB-${player._id}`}
                        />
                        <label htmlFor={`teamB-${player._id}`}>{player.name}</label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamSelection;

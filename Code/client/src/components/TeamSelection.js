import React from 'react';
import '../styles.css';

const TeamSelection = ({ teamA,teamB,players,handlePlayerSelection }) => {
    // Ensure teamA and teamB are arrays
    const teamAIds = Array.isArray(teamA) ? teamA : [];
    const teamBIds = Array.isArray(teamB) ? teamB : [];

    // Sort players alphabetically by name
    const sortedPlayers = [...players].sort((a,b) => a.name.localeCompare(b.name));

    return (
        <div className="teams">
            <div className="team">
                <h3>Team A</h3>
                {sortedPlayers.map(player => (
                    <div key={player._id}>
                        <input
                            type="checkbox"
                            value={player._id}
                            checked={teamAIds.includes(player._id)}
                            onChange={(e) => handlePlayerSelection(e,'A')}
                            disabled={teamBIds.includes(player._id)}
                            id={`teamA-${player._id}`}
                        />
                        <label htmlFor={`teamA-${player._id}`}>{player.name}</label>
                    </div>
                ))}
            </div>
            <div className="team">
                <h3>Team B</h3>
                {sortedPlayers.map(player => (
                    <div key={player._id}>
                        <input
                            type="checkbox"
                            value={player._id}
                            checked={teamBIds.includes(player._id)}
                            onChange={(e) => handlePlayerSelection(e,'B')}
                            disabled={teamAIds.includes(player._id)}
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

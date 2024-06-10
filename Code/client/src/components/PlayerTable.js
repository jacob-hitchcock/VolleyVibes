// src/components/PlayerTable.js
import React from 'react';

const PlayerTable = ({ players,handleEdit,handleDelete,loading }) => {
    if(loading) {
        return <div>Loading players...</div>;
    }

    return (
        <table className="playerlist">
            <thead className="sticky-header">
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {players.map(player => (
                    <tr key={player._id}>
                        <td>{player.name}</td>
                        <td>{player.age}</td>
                        <td>{player.gender}</td>
                        <td>
                            <button onClick={() => handleEdit(player)}>Edit</button>
                            <button onClick={() => handleDelete(player._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default PlayerTable;

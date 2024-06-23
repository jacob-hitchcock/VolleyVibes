import React from 'react';

const AdminPlayerTable = ({ players,handleEdit,handleDelete,loading }) => {
    if(loading) {
        return <div>Loading players...</div>;
    }

    // Sort players alphabetically by name
    const sortedPlayers = [...players].sort((a,b) => a.name.localeCompare(b.name));

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
                {sortedPlayers.map(player => (
                    <tr key={player._id}>
                        <td>{player.name}</td>
                        <td>{player.age}</td>
                        <td>{player.gender}</td>
                        <td>
                            <button style={{ marginRight: 10 }} onClick={() => handleEdit(player)}>Edit</button>
                            <button onClick={() => handleDelete(player._id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default AdminPlayerTable;

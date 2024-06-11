// src/pages/ProtectedComponent.js
import React,{ useState,useContext,useEffect } from 'react';
import axiosInstance from '../axiosInstance'; // Use the configured Axios instance
import AuthContext from '../context/AuthContext';
import NavBar from '../components/NavBar';
import LogoutButton from '../components/LogoutButton';
import PlayerForm from '../components/PlayerForm';
import AdminPlayerTable from '../components/AdminPlayerTable'; // Import the AdminPlayerTable
import useFormValidation from '../hooks/useFormValidation';
import { validatePlayerForm } from '../utils/utils';
import useFetchData from '../hooks/useFetchData';

const ProtectedComponent = () => {
    const { auth } = useContext(AuthContext);
    const { players,setPlayers,loading } = useFetchData();
    const { form,errors,handleChange,handleSubmit,setForm } = useFormValidation(
        { name: '',age: '',gender: '' },
        validatePlayerForm
    );
    const [editMode,setEditMode] = useState(false);
    const [currentPlayerId,setCurrentPlayerId] = useState(null);
    const [confirmationMessage,setConfirmationMessage] = useState('');

    useEffect(() => {
        if(confirmationMessage) {
            const timer = setTimeout(() => {
                setConfirmationMessage('');
            },15000); // 15 seconds
            return () => clearTimeout(timer);
        }
    },[confirmationMessage]);

    const onSubmit = () => {
        if(editMode) {
            axiosInstance.put(`/players/${currentPlayerId}`,form)
                .then(response => {
                    setPlayers(players.map(player => player._id === currentPlayerId ? response.data : player));
                    setEditMode(false);
                    setCurrentPlayerId(null);
                    setForm({ name: '',age: '',gender: '' });
                    setConfirmationMessage('Player updated successfully.');
                })
                .catch(error => console.error('Error updating player:',error));
        } else {
            axiosInstance.post('/players',form)
                .then(response => {
                    setPlayers([...players,response.data]);
                    setForm({ name: '',age: '',gender: '' });
                    setConfirmationMessage('Player added successfully.');
                })
                .catch(error => console.error('Error adding player:',error));
        }
    };

    const handleEdit = (player) => {
        if(window.confirm(`Are you sure you want to edit the player: ${player.name}?`)) {
            setForm({ name: player.name,age: player.age,gender: player.gender });
            setEditMode(true);
            setCurrentPlayerId(player._id);
        }
    };

    const handleDelete = (id) => {
        if(window.confirm('Are you sure you want to delete this player?')) {
            axiosInstance.delete(`/players/${id}`)
                .then(() => {
                    setPlayers(players.filter(player => player._id !== id));
                    setConfirmationMessage('Player deleted successfully.');
                })
                .catch(error => console.error('Error deleting player:',error));
        }
    };

    return (
        <div>
            <NavBar />
            <h2>Admin Dashboard</h2>
            <LogoutButton />
            {auth.user && auth.user.role === 'admin' ? (
                <div>
                    <h3>Manage Players</h3>
                    <PlayerForm
                        form={form}
                        errors={errors}
                        handleChange={handleChange}
                        handleSubmit={(e) => handleSubmit(e,onSubmit)}
                        editMode={editMode}
                    />
                    {confirmationMessage && (
                        <p style={{ color: 'green' }}>{confirmationMessage}</p>
                    )}
                    <AdminPlayerTable
                        players={players}
                        handleEdit={handleEdit}
                        handleDelete={handleDelete}
                        loading={loading}
                    />
                </div>
            ) : (
                    <p>You do not have admin privileges.</p>
                )}
        </div>
    );
};

export default ProtectedComponent;
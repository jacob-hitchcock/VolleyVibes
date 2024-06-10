import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { Link,useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import PlayerTable from '../components/PlayerTable';
import PlayerForm from '../components/PlayerForm';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import useFetchData from '../hooks/useFetchData';
import useFormValidation from '../hooks/useFormValidation';
import useToggle from '../hooks/useToggle';
import { validatePlayerForm } from '../utils/utils';
import '../styles.css';

function PlayerManagement() {
    const { players,loading,setPlayers } = useFetchData(); // Use the hook to get players data
    const { form,errors,handleChange,handleSubmit,setForm,setErrors } = useFormValidation(
        { name: '',age: '',gender: '' },
        validatePlayerForm
    );
    const [editMode,setEditMode] = useState(false);
    const [currentPlayerId,setCurrentPlayerId] = useState(null);
    const [search,setSearch] = useState('');
    const [searchVisible,toggleSearchVisible] = useToggle(false); // Use the useToggle hook
    const location = useLocation();

    const onSubmit = () => {
        if(editMode) {
            axios.put(`/api/players/${currentPlayerId}`,form)
                .then(response => {
                    setPlayers(players.map(player => player._id === currentPlayerId ? response.data : player));
                    setEditMode(false);
                    setCurrentPlayerId(null);
                    setForm({ name: '',age: '',gender: '' });
                })
                .catch(error => console.error('Error updating player:',error));
        } else {
            axios.post('/api/players',form)
                .then(response => {
                    setPlayers([...players,response.data]);
                    setForm({ name: '',age: '',gender: '' });
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
            axios.delete(`/api/players/${id}`)
                .then(() => {
                    setPlayers(players.filter(player => player._id !== id));
                })
                .catch(error => console.error('Error deleting player:',error));
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredPlayers = players.filter(player => player.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <NavBar />
            <h2 className="match-title">Players</h2>
            {loading ? (
                <div className="loading-indicator">Loading players...</div>
            ) : (
                    <>
                        <SearchBar
                            search={search}
                            handleSearchChange={handleSearchChange}
                            toggleSearchVisibility={toggleSearchVisible}
                            searchVisible={searchVisible}
                        />
                        <PlayerTable
                            players={filteredPlayers}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            loading={loading} // Pass the loading state
                        />
                    </>
                )}
            <PlayerForm
                form={form}
                errors={errors}
                handleChange={handleChange}
                handleSubmit={(e) => handleSubmit(e,onSubmit)}
                editMode={editMode}
            />
            <Footer />
        </div>
    );
}

export default PlayerManagement;

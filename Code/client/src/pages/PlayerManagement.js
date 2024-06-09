import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { Link,useLocation } from 'react-router-dom';
import '../styles.css';
import { FaSearch } from 'react-icons/fa';

function PlayerManagement() {
    const [players,setPlayers] = useState([]);
    const [form,setForm] = useState({ name: '',age: '',gender: '' });
    const [editMode,setEditMode] = useState(false);
    const [currentPlayerId,setCurrentPlayerId] = useState(null);
    const [errors,setErrors] = useState({});
    const [search,setSearch] = useState('');
    const [searchVisible,setSearchVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        axios.get('/api/players')
            .then(response => setPlayers(response.data))
            .catch(error => console.error('Error fetching players:',error));
    },[]);

    const handleChange = (e) => {
        const { name,value } = e.target;
        setForm({ ...form,[name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if(!form.name) {
            errors.name = 'Name is required';
        }
        if(form.age && (form.age < 0 || form.age > 120)) {
            errors.age = 'Age must be between 0 and 120';
        }
        if(!form.gender) {
            errors.gender = 'Gender is required';
        }
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if(Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        if(editMode) {
            axios.put(`/api/players/${currentPlayerId}`,form)
                .then(response => {
                    setPlayers(players.map(player => player._id === currentPlayerId ? response.data : player));
                    setEditMode(false);
                    setCurrentPlayerId(null);
                    setForm({ name: '',age: '',gender: '' });
                    setErrors({});
                })
                .catch(error => console.error('Error updating player:',error));
        } else {
            axios.post('/api/players',form)
                .then(response => {
                    setPlayers([...players,response.data]);
                    setForm({ name: '',age: '',gender: '' });
                    setErrors({});
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

    const toggleSearchVisibility = () => {
        setSearchVisible(!searchVisible);
        setSearch('');
    };

    const filteredPlayers = players.filter(player => player.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <header className="header">
                <nav className="nav-left">
                    <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
                    <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
                </nav>
                <div className="title-container">
                    <img src="/images/VolleyVibe.png" alt="VolleyVibe Logo" className="logo" />
                    <div className="title">
                        <div className="volley">Volley</div>
                        <div className="vibe">Vibe!</div>
                    </div>
                </div>
                <nav className="nav-right">
                    <Link to="/players" className={location.pathname === '/players' ? 'active' : ''}>Players</Link>
                    <Link to="/matches" className={location.pathname === '/matches' ? 'active' : ''}>Matches</Link>
                </nav>
            </header>
            <h2 className="match-title">Players</h2>
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
                    {filteredPlayers.map(player => (
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
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    {errors.name && <span className="error">{errors.name}</span>}
                </div>
                <div>
                    <label>Age:</label>
                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={form.age}
                        onChange={handleChange}
                    />
                    {errors.age && <span className="error">{errors.age}</span>}
                </div>
                <div>
                    <label>Gender:</label>
                    <input
                        type="text"
                        name="gender"
                        placeholder="Gender"
                        value={form.gender}
                        onChange={handleChange}
                        required
                    />
                    {errors.gender && <span className="error">{errors.gender}</span>}
                </div>
                <button type="submit">{editMode ? 'Update Player' : 'Add Player'}</button>
            </form>
            <footer>
                <img src="icon1.png" alt="icon1" />
                <img src="icon2.png" alt="icon2" />
            </footer>
        </div>
    );
}

export default PlayerManagement;

/*
Form to create new player, add in when admin is created

*/
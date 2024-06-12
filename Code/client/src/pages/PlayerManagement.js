// src/pages/PlayerManagement.js
import React,{ useState } from 'react';
import NavBar from '../components/NavBar';
import PlayerTable from '../components/PlayerTable';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import useFetchData from '../hooks/useFetchData';
import useToggle from '../hooks/useToggle';
import '../styles.css';

function PlayerManagement() {
    const { players,loading } = useFetchData(); // Use the hook to get players data
    const [search,setSearch] = useState('');
    const [searchVisible,toggleSearchVisible] = useToggle(false); // Use the useToggle hook

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const filteredPlayers = players.filter(player => player.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <NavBar />
            <h2 className="player-title">Players</h2>
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
                            loading={loading} // Pass the loading state
                        />
                    </>
                )}
            <Footer />
        </div>
    );
}

export default PlayerManagement;
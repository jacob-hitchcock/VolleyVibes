// src/pages/HomePage.js
import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import '../styles.css';
import NavBar from '../components/NavBar';
import PlayerTable from '../components/PlayerTable';
import Footer from '../components/Footer';
import useSortedPlayers from '../hooks/useSortedPlayers';
import useInitialLoad from '../hooks/useInitialLoad';

function HomePage() {
    const [players,setPlayers] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/players')
            .then(response => {
                setPlayers(response.data);
                setLoading(false);
            })
            .catch(error => console.error('Error fetching leaderboard:',error));
    },[]);

    const { sortedPlayers,requestSort,getSortIndicator,sortConfig } = useSortedPlayers(players);
    const initialLoad = useInitialLoad(1000); // 1 second duration for initial load animation

    return (
        <div>
            <NavBar />
            <main>
                <h2 className="match-title">Leaderboard</h2>
                <PlayerTable
                    players={sortedPlayers}
                    sortConfig={sortConfig}
                    requestSort={requestSort}
                    getSortIndicator={getSortIndicator}
                    initialLoad={initialLoad}
                    loading={loading}
                />
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;

// src/pages/HomePage.js
import React from 'react';
import '../styles.css';
import NavBar from '../components/NavBar';
import PlayerTable from '../components/Leaderboard';
import Footer from '../components/Footer';
import useSortedPlayers from '../hooks/useSortedPlayers';
import useInitialLoad from '../hooks/useInitialLoad';
import useFetchData from '../hooks/useFetchData';

function HomePage() {
    const { players,loading: dataLoading } = useFetchData();
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
                    loading={dataLoading}
                />
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;

import React,{ useEffect } from 'react';
import '../styles.css';
import NavBar from '../components/NavBar';
import Leaderboard from '../components/Leaderboard';
import Footer from '../components/Footer';
import useInitialLoad from '../hooks/useInitialLoad';
import useFetchData from '../hooks/useFetchData';
import useFilters from '../hooks/useFilters';
import useSortedPlayers from '../hooks/useSortedPlayers';
import FilterBar from '../components/FilterBar';

function HomePage() {
    const { matches,players,loading: dataLoading } = useFetchData();
    const initialLoad = useInitialLoad(1000); // 1 second duration for initial load animation

    const {
        filterPlayerDate,
        setFilterPlayerDate,
        filterPlayerLocations,
        setFilterPlayerLocations,
        aggregatedPlayerStats,
        resetPlayerFilters,
    } = useFilters(matches,players);

    // Apply sorting to the aggregated player stats
    const { sortedPlayers,requestSort,getSortIndicator,sortConfig } = useSortedPlayers(aggregatedPlayerStats);

    useEffect(() => {
        console.log('Aggregated Player Stats:',aggregatedPlayerStats);
    },[aggregatedPlayerStats]);

    return (
        <div>
            <NavBar />
            <main>
                <h2 className="match-title">Leaderboard</h2>
                <FilterBar
                    context="players"
                    filterPlayerDate={filterPlayerDate}
                    setFilterPlayerDate={setFilterPlayerDate}
                    filterPlayerLocations={filterPlayerLocations}
                    setFilterPlayerLocations={setFilterPlayerLocations}
                    availableLocations={['Grass','Beach','Indoor Court']}
                    resetFilters={resetPlayerFilters}
                />
                <Leaderboard
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

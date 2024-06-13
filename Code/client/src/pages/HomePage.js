import React from 'react';
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

    return (
        <div>
            <NavBar />
            <main>
                <h2 className="leader-title">Leaderboard</h2>
                <div className="home-content">
                    <FilterBar
                        context="players"
                        filterPlayerDate={filterPlayerDate}
                        setFilterPlayerDate={setFilterPlayerDate}
                        filterPlayerLocations={filterPlayerLocations}
                        setFilterPlayerLocations={setFilterPlayerLocations}
                        availableLocations={['Grass','Beach','Indoor Court']}
                        resetFilters={resetPlayerFilters}
                    />
                    <div className="leaderboard-container">
                        <Leaderboard
                            players={sortedPlayers}
                            sortConfig={sortConfig}
                            requestSort={requestSort}
                            getSortIndicator={getSortIndicator}
                            initialLoad={initialLoad}
                            loading={dataLoading}
                        />
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default HomePage;

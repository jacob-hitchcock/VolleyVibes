import React,{ useState,useEffect } from 'react';
import '../styles.css';
import NavBar from '../components/NavBar';
import Leaderboard from '../components/Leaderboard';
import Footer from '../components/Footer';
import useInitialLoad from '../hooks/useInitialLoad';
import useFetchData from '../hooks/useFetchData';
import useFilters from '../hooks/useFilters';
import useSortedPlayers from '../hooks/useSortedPlayers';
import FilterBar from '../components/FilterBar';
import SkeletonLeaderboard from '../components/SkeletonLeaderboard';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';

function HomePage() {
    const { matches,players,loading } = useFetchData();
    const initialLoad = useInitialLoad(2000); // About 1.555 second duration for initial load animation

    const {
        filterPlayerDate,
        setFilterPlayerDate,
        filterPlayerLocations,
        setFilterPlayerLocations,
        aggregatedPlayerStats,
        resetPlayerFilters,
    } = useFilters(matches,players);

    const { sortedPlayers,requestSort,getSortIndicator,sortConfig } = useSortedPlayers(aggregatedPlayerStats);

    const [openSnackbar,setOpenSnackbar] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpenSnackbar(false);
        },10000); // 10 seconds

        return () => clearTimeout(timer);
    },[]);

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
                    {loading ? (
                        <SkeletonLeaderboard />
                    ) : (
                            <div className="leaderboard-container">
                                <Leaderboard
                                    players={sortedPlayers}
                                    sortConfig={sortConfig}
                                    requestSort={requestSort}
                                    getSortIndicator={getSortIndicator}
                                    initialLoad={initialLoad}
                                    loading={loading}
                                />
                            </div>
                        )}
                </div>
            </main>
            <Footer />

            <Snackbar open={openSnackbar} autoHideDuration={10000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} sx={{ width: '100%',backgroundColor: '#E7552B',color: '#fff5d6' }}>
                    Track new achievements on the <Link to="/milestones" style={{ color: '#fff5d6',textDecoration: 'underline' }}>milestones page</Link>!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default HomePage;

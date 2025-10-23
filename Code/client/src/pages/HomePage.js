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
import MatchGrid from '../components/MatchGrid';
import SkeletonMatchGrid from '../components/SkeletonMatchGrid';
import MatchDetailsModal from '../components/MatchDetailsModal';
import { getPlayerName,formatDate,getWinners,getLosers,groupMatchesByDate,isTeamAWinner } from '../utils/utils';

function HomePage() {
    const { matches,players,loading, playerStats } = useFetchData();
     const [initalLoadDuration, setInitialLoadDuration] = useState(2000);

     useEffect(() => {
        if (players.length > 0) {
            setInitialLoadDuration(players.length * 215);
        }
     }, [players.length])

     const initialLoad = useInitialLoad(initalLoadDuration);


    const mergedPlayers = players.map(player => {
        const last10 = playerStats.find(l => l._id === player._id)?.last10 || null;
        return {...player, last10};
    });
    
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
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [selectedMatch,setSelectedMatch] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpenSnackbar(false);
        },10000); // 10 seconds

        return () => clearTimeout(timer);
    },[]);

    // Find the most recent date from matches
    const mostRecentDate = matches.length > 0 ? matches.reduce((latest,match) => {
        const matchDate = new Date(match.date);
        return matchDate > new Date(latest.date) ? match : latest;
    }).date : null;

    // Filter matches by the most recent date
    const recentMatches = mostRecentDate ? matches.filter(match => match.date === mostRecentDate) : [];

    const groupedMatches = groupMatchesByDate(recentMatches);

    const openModal = (match) => {
        setSelectedMatch(match);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedMatch(null);
    };

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
                                    last10={mergedPlayers}
                                    sortConfig={sortConfig}
                                    requestSort={requestSort}
                                    getSortIndicator={getSortIndicator}
                                    initialLoad={initialLoad}
                                    loading={loading}
                                />
                            </div>
                        )}
                </div>
                <div className="recent-matches">
                    <h2 className="match-title">Recent Matches</h2>
                    {loading ? (
                        <SkeletonMatchGrid />
                    ) : (
                            <MatchGrid
                                groupedMatches={groupedMatches}
                                getWinners={(match) => getWinners(match,(id) => getPlayerName(id,players))}
                                getLosers={(match) => getLosers(match,(id) => getPlayerName(id,players))}
                                formatDate={formatDate}
                                openModal={openModal}
                            />
                        )}
                    <div className="see-more">
                        <Link to="/matches" className="see-more-link">See More</Link>
                    </div>
                </div>
            </main>
            <Footer />
            <Snackbar open={openSnackbar} autoHideDuration={10000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} sx={{ width: '100%',backgroundColor: '#E7552B',color: '#fff5d6' }}>
                    See how you rank by tapping the column headers to sort the leaderboard.
                </Alert>
            </Snackbar>
            {isModalOpen && selectedMatch && (
                <MatchDetailsModal
                    className="match-management-modal"
                    selectedMatch={selectedMatch}
                    isTeamAWinner={isTeamAWinner}
                    getPlayerName={(id) => getPlayerName(id,players)}
                    formatDate={formatDate}
                    closeModal={closeModal}
                />
            )}
        </div>
    );
}

export default HomePage;

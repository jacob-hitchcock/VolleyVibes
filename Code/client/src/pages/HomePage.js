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
                    Track new achievements on the <Link to="/milestones" style={{ color: '#fff5d6',textDecoration: 'underline' }}>milestones page</Link>!
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

import React,{ useState,useRef } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import useFetchData from '../hooks/useFetchData';
import useFilters from '../hooks/useFilters';
import PlayerStats from '../components/PlayerStats';
import Timeline from '../components/Timeline';
import '../styles.css';

const MilestonesPage = () => {
    const { matches,players,loading,error } = useFetchData();
    const { didPlayerTeamWin,aggregatedPlayerStats } = useFilters(matches,players);
    const [milestones,setMilestones] = useState([]);
    const addedMilestonesRef = useRef(new Set());

    const handleMilestone = (milestone) => {
        if(!addedMilestonesRef.current.has(milestone.player + milestone.title)) {
            console.log(`Adding milestone: ${milestone.title} for ${milestone.player}`);
            setMilestones((prevMilestones) => [...prevMilestones,milestone].sort((a,b) => new Date(b.date) - new Date(a.date)));
            addedMilestonesRef.current.add(milestone.player + milestone.title);
        }
    };

    if(loading) return <div>Loading...</div>;
    if(error) return <div>Error loading milestone data.</div>;

    return (
        <div>
            <NavBar />
            <div className="milestones-page">
                <h1>League Milestones</h1>
                <ul>
                    {players.map((player) => (
                        <PlayerStats
                            key={player._id}
                            player={player}
                            matches={matches}
                            didPlayerTeamWin={didPlayerTeamWin}
                            aggregatedPlayerStats={aggregatedPlayerStats}
                            onMilestone={handleMilestone}
                        />
                    ))}
                </ul>
                <Timeline milestones={milestones} />
            </div>
            <Footer />
        </div>
    );
};

export default MilestonesPage;

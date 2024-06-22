import React,{ useEffect,useState } from 'react';
import usePlayerPerformance from '../hooks/usePlayerPerformance';

const PlayerStats = ({ player,matches,didPlayerTeamWin,aggregatedPlayerStats,onMilestone }) => {
    const playerPerformance = usePlayerPerformance(player._id,matches,didPlayerTeamWin,aggregatedPlayerStats);
    const [milestonesAdded,setMilestonesAdded] = useState({});

    useEffect(() => {
        if(playerPerformance && playerPerformance.milestones) {
            playerPerformance.milestones.forEach((milestone) => {
                if(!milestonesAdded[milestone.milestone]) {
                    console.log(`Adding milestone for ${player.name}`);
                    onMilestone({
                        player: player.name,
                        date: milestone.date,
                        title: `${player.name} ${milestone.milestone}`,
                        description: `${player.name} ${milestone.milestone.toLowerCase()}.`,
                    });
                    setMilestonesAdded((prev) => ({ ...prev,[milestone.milestone]: true }));
                }
            });
        }
    },[playerPerformance,onMilestone,player.name,milestonesAdded]);

    if(!playerPerformance) return null;

    return (
        <div></div>
    );
};

export default PlayerStats;

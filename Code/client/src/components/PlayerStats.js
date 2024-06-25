import React,{ useEffect,useState } from 'react';
import usePlayerPerformance from '../hooks/usePlayerPerformance';

const PlayerStats = ({ player,matches,didPlayerTeamWin,aggregatedPlayerStats,onMilestone,players }) => {
    const playerPerformance = usePlayerPerformance(player._id,matches,didPlayerTeamWin,aggregatedPlayerStats,players);
    const [milestonesAdded,setMilestonesAdded] = useState({});

    useEffect(() => {
        if(playerPerformance && playerPerformance.milestones) {
            playerPerformance.milestones.forEach((milestone) => {
                if(!milestonesAdded[milestone.milestone]) {
                    onMilestone({
                        player: player.name,
                        date: milestone.date,
                        title: getTitleForMilestone(milestone),
                        description: `${player.name} ${milestone.milestone}`,
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

const getTitleForMilestone = (milestone) => {
    if(milestone.milestone.includes('Win Streak')) return "On Fire";
    if(milestone.milestone.includes('Games Played')) return "Seasoned Pro";
    if(milestone.milestone.includes('Wins')) return "Victory Collector";
    if(milestone.milestone.includes('VWAR')) return "Metrics Master";
    if(milestone.milestone.includes('Game Together')) return "Constant Companions";
    if(milestone.milestone.includes('Lost Together')) return "End Of An Era";
    if(milestone.milestone.includes('Won Together')) return "Breaking The Curse";
    if(milestone.milestone.includes('Defeated')) return "Rival Vanquished";
    return "Milestone";
};

export default PlayerStats;

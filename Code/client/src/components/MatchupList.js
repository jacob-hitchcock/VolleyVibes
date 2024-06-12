import React from 'react';
import MatchupCard from './MatchupCard';
import '../styles.css';

const MatchupList = ({ matchups,toggleCompleted,isGenerated }) => (
    <div className="combos-list">
        {matchups.map((matchup,index) => (
            <MatchupCard
                key={index}
                matchup={matchup}
                index={index}
                toggleCompleted={toggleCompleted}
                isGenerated={isGenerated}
            />
        ))}
    </div>
);

export default MatchupList;
import React from 'react';
import PropTypes from 'prop-types';
import MatchupCard from './MatchupCard';
import '../styles.css';

const MatchupList = ({ matchups,toggleCompleted,isGenerated }) => (
    <div className="combos-list">
        {matchups.length === 0 ? (
            <p>No matchups available.</p>
        ) : (
                matchups.map((matchup,index) => (
                    <MatchupCard
                        key={index}
                        matchup={matchup}
                        index={index}
                        toggleCompleted={toggleCompleted}
                        isGenerated={isGenerated}
                    />
                ))
            )}
    </div>
);

MatchupList.propTypes = {
    matchups: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleCompleted: PropTypes.func.isRequired,
    isGenerated: PropTypes.bool.isRequired,
};

export default React.memo(MatchupList);
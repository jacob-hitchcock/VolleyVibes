import React from 'react';
import PropTypes from 'prop-types';
import MatchupCard from './MatchupCard';
import '../styles.css';

const MatchupList = ({ matchups,toggleCompleted,isGenerated,predictions = [] }) => (
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
                        prediction={predictions[index]} // Pass the prediction to MatchupCard
                    />
                ))
            )}
    </div>
);

MatchupList.propTypes = {
    matchups: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleCompleted: PropTypes.func.isRequired,
    isGenerated: PropTypes.bool.isRequired,
    predictions: PropTypes.arrayOf(PropTypes.object) // Add prop type for predictions
};

export default React.memo(MatchupList);

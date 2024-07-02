import React from 'react';
import PropTypes from 'prop-types';

const CrossReferenceGrid = ({
    playerNumbers,
    crossReferenceGrid,
    cvArray,
    overallCV,
    teamACounts,
    teamAStdDev,
    isOddPlayers,
}) => {
    return (
        <div className="cross-reference-grid">
            {crossReferenceGrid.length > 0 && (
                <div>
                    <h3>Matchup Counts</h3>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                {playerNumbers.map(player => (
                                    <th key={player.number}>{player.number}</th>
                                ))}
                                <th>Balance</th>
                                {isOddPlayers && <th>Team A Count</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {playerNumbers.map((player,rowIndex) => (
                                <tr key={player.number}>
                                    <th>{player.number}</th>
                                    {crossReferenceGrid[rowIndex].map((count,colIndex) => (
                                        <td key={colIndex}>{count}</td>
                                    ))}
                                    <td>{cvArray[rowIndex] !== undefined ? cvArray[rowIndex].toFixed(2) : 'N/A'}</td>
                                    {isOddPlayers && <td>{teamACounts[rowIndex]}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="overall-cv">
                        <h4>Overall Balance (Lower is Better): {overallCV.toFixed(2)}</h4>
                        {isOddPlayers && <h4>Team A Balance (Lower is Better): {teamAStdDev.toFixed(2)}</h4>}
                    </div>
                </div>
            )}
        </div>
    );
};

CrossReferenceGrid.propTypes = {
    playerNumbers: PropTypes.array.isRequired,
    crossReferenceGrid: PropTypes.array.isRequired,
    cvArray: PropTypes.array.isRequired,
    overallCV: PropTypes.number.isRequired,
    teamACounts: PropTypes.array.isRequired,
    teamAStdDev: PropTypes.number.isRequired,
    isOddPlayers: PropTypes.bool.isRequired,
};

export default CrossReferenceGrid;

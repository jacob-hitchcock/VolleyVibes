import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Leaderboard = React.memo(({ players,sortConfig,requestSort,getSortIndicator,initialLoad,loading }) => (
    <div className="leaderboard-table-wrapper">
        <table className="leaderlist">
            <thead>
                <tr>
                    <th className={`sticky-column ${sortConfig.key === 'name' ? 'sorted' : ''}`} onClick={() => requestSort('name')}>
                        <div className="header-content">
                            <span className="header-text">Name</span>
                            {getSortIndicator('name')}
                        </div>
                    </th>
                    <th className={sortConfig.key === 'gamesPlayed' ? 'sorted' : ''} onClick={() => requestSort('gamesPlayed')}>
                        <div className="header-content">
                            <span className="header-text">Games Played</span>
                            {getSortIndicator('gamesPlayed')}
                        </div>
                    </th>
                    <th className={sortConfig.key === 'wins' ? 'sorted' : ''} onClick={() => requestSort('wins')}>
                        <div className="header-content">
                            <span className="header-text">Wins</span>
                            {getSortIndicator('wins')}
                        </div>
                    </th>
                    <th className={sortConfig.key === 'losses' ? 'sorted' : ''} onClick={() => requestSort('losses')}>
                        <div className="header-content">
                            <span className="header-text">Losses</span>
                            {getSortIndicator('losses')}
                        </div>
                    </th>
                    <th className={sortConfig.key === 'winningPercentage' ? 'sorted' : ''} onClick={() => requestSort('winningPercentage')}>
                        <div className="header-content">
                            <span className="header-text">Winning %</span>
                            {getSortIndicator('winningPercentage')}
                        </div>
                    </th>
                    <th className={sortConfig.key === 'pointsFor' ? 'sorted' : ''} onClick={() => requestSort('pointsFor')}>
                        <div className="header-content">
                            <span className="header-text">Points For</span>
                            {getSortIndicator('pointsFor')}
                        </div>
                    </th>
                    <th className={sortConfig.key === 'pointsAgainst' ? 'sorted' : ''} onClick={() => requestSort('pointsAgainst')}>
                        <div className="header-content">
                            <span className="header-text">Points Against</span>
                            {getSortIndicator('pointsAgainst')}
                        </div>
                    </th>
                    <th className={sortConfig.key === 'pointDifferential' ? 'sorted' : ''} onClick={() => requestSort('pointDifferential')}>
                        <div className="header-content">
                            <span className="header-text">Point Differential</span>
                            {getSortIndicator('pointDifferential')}
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {!loading && players.map((player,index) => {
                    const winningPercentage = player.gamesPlayed ? (player.wins / player.gamesPlayed).toFixed(3) : '0.000';
                    return (
                        <tr
                            key={player._id}
                            className={initialLoad ? "flip-in" : ""}
                            style={initialLoad ? { animationDelay: `${index * 0.1}s` } : {}}
                        >
                            <td className="sticky-column">
                                <Link className="name-link" to={`/profile/${player._id}`}>{player.name}</Link>
                            </td>
                            <td>{player.gamesPlayed}</td>
                            <td>{player.wins}</td>
                            <td>{player.gamesPlayed - player.wins}</td>
                            <td>{winningPercentage}</td>
                            <td>{player.pointsFor}</td>
                            <td>{player.pointsAgainst}</td>
                            <td>{player.pointDifferential}</td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
));

Leaderboard.propTypes = {
    players: PropTypes.array.isRequired,
    sortConfig: PropTypes.object.isRequired,
    requestSort: PropTypes.func.isRequired,
    getSortIndicator: PropTypes.func.isRequired,
    initialLoad: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default Leaderboard;

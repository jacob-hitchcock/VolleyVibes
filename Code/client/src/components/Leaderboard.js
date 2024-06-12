import React from 'react';

const Leaderboard = ({ players,sortConfig,requestSort,getSortIndicator,initialLoad,loading }) => (
    <table className="leaderlist">
        <thead>
            <tr>
                <th className={sortConfig.key === 'name' ? 'sorted' : ''} onClick={() => requestSort('name')}>
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
                        <td>{player.name}</td>
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
);

export default Leaderboard;

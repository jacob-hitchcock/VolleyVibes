import { useState } from 'react';

const useSortedPlayers = (players) => {
    const [sortConfig,setSortConfig] = useState({ key: 'wins',direction: 'descending' });

    const sortedPlayers = [...players].sort((a,b) => {
        const aLosses = a.gamesPlayed - a.wins;
        const bLosses = b.gamesPlayed - b.wins;
        const aWinningPercentage = a.gamesPlayed ? (a.wins / a.gamesPlayed).toFixed(3) : 0;
        const bWinningPercentage = b.gamesPlayed ? (b.wins / b.gamesPlayed).toFixed(3) : 0;

        if(sortConfig.key === 'losses') {
            if(aLosses < bLosses) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if(aLosses > bLosses) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        } else if(sortConfig.key === 'winningPercentage') {
            if(aWinningPercentage < bWinningPercentage) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if(aWinningPercentage > bWinningPercentage) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
        } else {
            if(a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if(a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            if(sortConfig.key === 'wins' || sortConfig.key === 'pointDifferential') {
                return a.pointDifferential < b.pointDifferential ? 1 : -1;
            }
        }
        return 0;
    });

    const requestSort = key => {
        let direction = 'descending';
        if(sortConfig.key === key) {
            direction = sortConfig.direction === 'descending' ? 'ascending' : 'descending';
        } else if(key === 'winningPercentage') {
            direction = 'descending'; // Set initial direction to descending for winningPercentage
        } else if(key === 'name' || key === 'pointsAgainst' || key === 'losses') {
            direction = 'ascending';
        }
        setSortConfig({ key,direction });
    };

    const getSortIndicator = key => {
        if(sortConfig.key === key) {
            const directionClass = sortConfig.direction === 'ascending' ? 'sorted-ascending' : 'sorted-descending';
            return (
                <span className={`sort-indicator ${directionClass}`}>
                    {sortConfig.direction === 'ascending' ? '▲' : '▼'}
                </span>
            );
        }
        return <span className="sort-indicator"></span>; // Default state
    };

    return { sortedPlayers,requestSort,getSortIndicator,sortConfig };
};

export default useSortedPlayers;
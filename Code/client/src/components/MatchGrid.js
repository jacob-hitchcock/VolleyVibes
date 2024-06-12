import React from 'react';
import MatchCard from './MatchCard';
import '../styles.css';

const MatchGrid = ({ groupedMatches,getWinners,getLosers,formatDate,openModal,handleEdit,handleDelete,isAdmin }) => {
    const renderMatches = (matches) => {
        const rows = [];
        for(let i = 0;i < matches.length;i += 3) {
            rows.push(
                <div key={i} className="match-row">
                    {matches.slice(i,i + 3).map(match => (
                        <MatchCard
                            key={match._id}
                            match={match}
                            getWinners={getWinners}
                            getLosers={getLosers}
                            formatDate={formatDate}
                            openModal={openModal}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                            isAdmin={isAdmin}
                        />
                    ))}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="match-grid">
            {Object.keys(groupedMatches).sort((a,b) => new Date(b) - new Date(a)).map(date => (
                <div key={date}>
                    <div className="date-header">{formatDate(date)}</div>
                    <div className="date-group">
                        {renderMatches(groupedMatches[date])}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MatchGrid;
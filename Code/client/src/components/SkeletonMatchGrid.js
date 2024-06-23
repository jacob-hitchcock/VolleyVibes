import React from 'react';
import { Skeleton } from '@mui/material';
import SkeletonMatchCard from './SkeletonMatchCard';
import '../styles.css';

const SkeletonMatchGrid = () => {
    const renderSkeletonMatches = () => {
        const rows = [];
        for(let i = 0;i < 3;i++) {
            rows.push(
                <div key={i} className="match-row">
                    {[...Array(3)].map((_,j) => (
                        <SkeletonMatchCard key={j} />
                    ))}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="match-grid">
            {[...Array(3)].map((_,i) => (
                <div key={i}>
                    <Skeleton variant="text" width="20%" height={40} sx={{ marginTop: '-14px' }} />
                    <div className="date-group">
                        {renderSkeletonMatches()}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SkeletonMatchGrid;

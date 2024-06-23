import React from 'react';
import { Skeleton } from '@mui/material';

const SkeletonPlayerCheckboxList = () => {
    const skeletonArray = Array.from({ length: 10 }); // Adjust the length based on expected number of players or rows

    return (
        <div className="players-list-container">
            <div className="players-list">
                {skeletonArray.map((_,index) => (
                    <div key={index} className="player-checkbox">
                        <Skeleton variant="rectangular" width={150} height={20} />
                    </div>
                ))}
            </div>
            <div className="player-checkbox-actions">
                <Skeleton variant="rectangular" width={210} height={18} sx={{ marginRight: '10px' }} />
                <Skeleton variant="rectangular" width={210} height={18} />
            </div>
        </div>
    );
};

export default SkeletonPlayerCheckboxList;

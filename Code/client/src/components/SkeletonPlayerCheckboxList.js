import React from 'react';
import { Skeleton } from '@mui/material';
import '../styles.css';

const SkeletonPlayerCheckboxList = () => {
    const skeletonArray = Array.from({ length: 10 }); // Adjust the length based on expected number of players or rows
    const half = Math.ceil(skeletonArray.length / 2);
    const leftColumnSkeletons = skeletonArray.slice(0,half);
    const rightColumnSkeletons = skeletonArray.slice(half);

    return (
        <div className="players-list-container">
            <div className="players-list-columns">
                <div className="players-list-column">
                    {leftColumnSkeletons.map((_,index) => (
                        <div key={index} className="player-checkbox">
                            <Skeleton variant="rectangular" width={150} height={20} />
                        </div>
                    ))}
                </div>
                <div className="players-list-column">
                    {rightColumnSkeletons.map((_,index) => (
                        <div key={index} className="player-checkbox">
                            <Skeleton variant="rectangular" width={150} height={20} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="players-list-actions">
                <Skeleton variant="rectangular" width={210} height={18} sx={{ marginRight: '10px' }} />
                <Skeleton variant="rectangular" width={210} height={18} />
            </div>
        </div>
    );
};

export default SkeletonPlayerCheckboxList;

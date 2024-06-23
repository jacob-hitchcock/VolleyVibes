import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import '../styles.css';

const SkeletonFilterBar = () => {
    return (
        <div className="filter-bar">
            <div className="filter-group">
                <Skeleton variant="rectangular" width={100} height={70} />
                <Skeleton variant="rectangular" width={100} height={70} />
                <Skeleton variant="rectangular" width={100} height={70} />
                <Skeleton variant="rectangular" width={100} height={70} />
            </div>
            <div className="filter-controls">
                <Skeleton variant="rectangular" width={100} height={70} />
            </div>
        </div>
    );
};

export default SkeletonFilterBar;

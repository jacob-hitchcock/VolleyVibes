import React from 'react';
import { Skeleton } from '@mui/material';
import '../styles.css';

const SkeletonMatchCard = () => {
    return (
        <div className="match-card">
            <Skeleton variant="text" width="60%" height={30} sx={{ marginBottom: '10px' }} />
            <Skeleton variant="text" width="60%" height={30} sx={{ marginBottom: '10px' }} />
            <Skeleton variant="text" width="80%" height={20} sx={{ marginBottom: '10px' }} />
            <Skeleton variant="rectangular" width={80} height={30} sx={{ marginBottom: '10px' }} />
        </div>
    );
};

export default SkeletonMatchCard;

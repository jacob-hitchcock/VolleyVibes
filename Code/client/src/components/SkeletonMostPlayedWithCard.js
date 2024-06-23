import React from 'react';
import { Card,CardContent,Skeleton } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
    width: '100%', // Set a specific width
    height: '100%',
    boxShadow: '3',
    border: '1px solid #e7552b',
    borderRadius: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center horizontally
    flexDirection: 'column',
});

const SkeletonMostPlayedWithCard = () => (
    <StyledCard>
        <CardContent>
            <Skeleton variant="text" width={200} height={37} />
            <Skeleton variant="text" width={200} height={50} />
            <Skeleton variant="text" width={200} height={20} />
        </CardContent>
    </StyledCard>
);

export default SkeletonMostPlayedWithCard;

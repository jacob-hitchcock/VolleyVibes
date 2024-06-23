import React from 'react';
import { Card,CardContent,Typography } from '@mui/material';
import { styled } from '@mui/system';
import Skeleton from '@mui/material/Skeleton';

const StyledCard = styled(Card)({
    width: '100%', // Set a specific width
    height: '100%',
    boxShadow: '3',
    borderRadius: '15px',
    backgroundColor: '#e7552b',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '6',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center horizontally
    flexDirection: 'column',
});

const StatCardSkeleton = () => {
    return (
        <StyledCard>
            <CardContent>
                <Skeleton variant="text" width={100} height={30} sx={{ marginBottom: '10px' }} />
                <Skeleton variant="text" width={100} height={35} sx={{ marginBottom: '10px' }} />
                <Skeleton variant="text" width={100} height={12} />
            </CardContent>
        </StyledCard>
    );
};

export default StatCardSkeleton;

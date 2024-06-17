import React from 'react';
import { Card,CardContent,Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
    width: '220px', // Set a specific width
    height: '80%',
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

const StatTypography = styled(Typography)(({ theme }) => ({
    fontFamily: 'Coolvetica',
}));

const TitleTypography = styled(StatTypography)({
    color: ' #fff5d6',
    textAlign: 'center', // Center text within the container
});

const ValueTypography = styled(StatTypography)({
    color: ' #fff5d6',
    textAlign: 'center', // Center text within the container
});

const RankTypography = styled(StatTypography)({
    color: ' #fff5d6',
    textAlign: 'center', // Center text within the container
});

const StatCard = ({ title,value,rank }) => {
    return (
        <StyledCard>
            <CardContent>
                <TitleTypography variant="h6" component="div">
                    {title}
                </TitleTypography>
                <ValueTypography variant="h4" component="div">
                    {value}
                </ValueTypography>
                <RankTypography>
                    Rank: {rank}
                </RankTypography>
            </CardContent>
        </StyledCard>
    );
};

export default StatCard;

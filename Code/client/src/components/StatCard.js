import React from 'react';
import { Card,CardContent,Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
    width: '220px', // Set a specific width
    height: '75%',
    boxShadow: '3',
    border: '1px solid #e7552b',
    borderRadius: '5px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)',
        boxShadow: '6',
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center', // Center horizontally
    flexDirection: 'column',
    marginTop: '15px',
    marginRight: '40px', // Adjust margin to ensure spacing between cards
});

const StatTypography = styled(Typography)(({ theme }) => ({
    fontFamily: 'Coolvetica',
}));

const TitleTypography = styled(StatTypography)({
    color: 'black',
    textAlign: 'center', // Center text within the container
});

const ValueTypography = styled(StatTypography)({
    color: '#e7552b',
    textAlign: 'center', // Center text within the container
});

const RankTypography = styled(StatTypography)({
    color: 'Gray',
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

// src/components/StatCard.js
import React from 'react';
import { Card,CardContent,Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
    minWidth: 150,
    margin: 2,
    boxShadow: 3,
    border: '1px solid #e7552b',
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
});

const StatTypography = styled(Typography)(({ theme }) => ({
    fontFamily: 'Coolvetica',
}));

const TitleTypography = styled(StatTypography)({
    color: 'black',
});

const ValueTypography = styled(StatTypography)({
    color: '#e7552b',
});

const StatCard = ({ title,value }) => {
    return (
        <StyledCard>
            <CardContent>
                <TitleTypography variant="h6" component="div">
                    {title}
                </TitleTypography>
                <ValueTypography variant="h4" component="div">
                    {value}
                </ValueTypography>
            </CardContent>
        </StyledCard>
    );
};

export default StatCard;

// src/components/ChartCard.js
import React from 'react';
import { Card,CardContent } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
    width: '60%',
    height: '400px',
    marginTop: '-20px',
    boxShadow: '3',
    border: '1px solid #e7552b',
    borderRadius: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    display: 'flex',
    flexDirection: 'column',
});

const ChartCard = ({ children }) => {
    return (
        <StyledCard>
            <CardContent>
                {children}
            </CardContent>
        </StyledCard>
    );
};

export default ChartCard;

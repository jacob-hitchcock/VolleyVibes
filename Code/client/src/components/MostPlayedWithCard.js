import React from 'react';
import { Card,CardContent,Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
    width: '100%', // Set a specific width
    height: '100%',
    boxShadow: '3',
    border: '1px solid #e7552b',
    borderRadius: '15px',
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
});

const TitleTypography = styled(Typography)({
    fontFamily: 'Coolvetica',
    color: 'black',
    textAlign: 'center',
});

const ValueTypography = styled(Typography)({
    fontFamily: 'Coolvetica',
    color: '#e7552b',
    textAlign: 'center',
});

const GamesPlayedTypography = styled(Typography)({
    fontFamily: 'Coolvetica',
    color: 'gray',
    textAlign: 'center',
    marginTop: '10px',
});

const MostPlayedWithCard = ({ playerName,gamesPlayed }) => (
    <StyledCard>
        <CardContent>
            <TitleTypography variant="h6" component="div">
                Most Common Teammate
            </TitleTypography>
            <ValueTypography variant="h4" component="div">
                {playerName || 'No data available'}
            </ValueTypography>
            {playerName && (
                <GamesPlayedTypography variant="body1" component="div">
                    Played {gamesPlayed} games together
                </GamesPlayedTypography>
            )}
        </CardContent>
    </StyledCard>
);

export default MostPlayedWithCard;

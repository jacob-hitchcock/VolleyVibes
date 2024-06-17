import React from 'react';
import { Card,CardContent,Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
    width: '100%',
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
    justifyContent: 'center',
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

const ContributionPercentageTypography = styled(Typography)({
    fontFamily: 'Coolvetica',
    color: 'gray',
    textAlign: 'center',
    marginTop: '10px',
});

const HighestContributingTeammateCard = ({ playerName,contributionPercentage,yourWins }) => (
    <StyledCard>
        <CardContent>
            <TitleTypography variant="h6" component="div">
                Key Contributer
            </TitleTypography>
            <ValueTypography variant="h4" component="div">
                {playerName || 'No data available'}
            </ValueTypography>
            {playerName && (
                <ContributionPercentageTypography variant="body1" component="div">
                    Contributed to {contributionPercentage}% of {yourWins} wins
                </ContributionPercentageTypography>
            )}
        </CardContent>
    </StyledCard>
);

export default HighestContributingTeammateCard;
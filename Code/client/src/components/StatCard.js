// src/components/StatCard.js
import React from 'react';
import { Card,CardContent,Typography,Box } from '@mui/material';
import { styled } from '@mui/system';

const StatCard = ({ title,value }) => {
    return (
        <Card sx={{ minWidth: 150,margin: 2,boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {title}
                </Typography>
                <Typography variant="h4" component="div" color="primary">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StatCard;

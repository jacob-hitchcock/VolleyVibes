// src/components/StatCard.js

import React from 'react';
import { Card,CardContent,Typography,Box } from '@mui/material';

const StatCard = ({ icon,title,value }) => {
    return (
        <Card sx={{ minWidth: 150,minHeight: 100,m: 1,backgroundColor: 'white',borderRadius: 2 }}>
            <CardContent>
                <Box display="flex" alignItems="center">
                    <Box sx={{ mr: 2 }}>{icon}</Box>
                    <Box>
                        <Typography variant="body2" color="textSecondary">{title}</Typography>
                        <Typography variant="h5">{value}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatCard;

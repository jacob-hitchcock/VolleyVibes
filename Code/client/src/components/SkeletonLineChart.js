import React from 'react';
import { Skeleton } from '@mui/material';
import { Box,Typography } from '@mui/material';
import ChartCard from '../components/ChartCard';
import '../styles.css';

const SkeletonLineChart = () => {
    return (
        <ChartCard>
            <Box sx={{ display: 'flex',padding: 1 }}>
                <Box sx={{ marginRight: 4 }}>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={120} height={40} />
                    <Skeleton variant="text" width={120} height={20} />
                </Box>
                <Box sx={{ flexGrow: 1,marginLeft: '-160px',marginTop: '110px' }}>
                    <Skeleton variant="rectangular" width="100%" height={450} />
                </Box>
            </Box>
        </ChartCard>
    );
};

export default SkeletonLineChart;

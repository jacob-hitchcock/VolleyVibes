import React from 'react';
import { LineChart,ResponsiveContainer } from 'recharts';
import { vwarChartConfig } from '../config/vwarConfig';
import ChartCard from '../components/ChartCard';
import { Box,Typography } from '@mui/material';

// Utility function to format the date without the year
const formatDateWithoutYear = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long',day: 'numeric' };
    return date.toLocaleDateString(undefined,options);
};

const VWARChart = ({ data,dataKey,title,strokeColor,displayName,overallWinningPercentage,animate }) => {
    const chartConfig = vwarChartConfig(dataKey,strokeColor,title,displayName,animate);

    // Calculate the change in winning percentage
    const recentData = data.length > 1 ? data[data.length - 1] : null;
    const previousData = data.length > 1 ? data[data.length - 2] : null;
    const changeInVWAR = recentData && previousData
        ? (recentData.VWAR - previousData.VWAR).toFixed(2)
        : '0.000';
    const previousDate = previousData ? formatDateWithoutYear(previousData.date) : '';

    return (
        <ChartCard>
            <Box sx={{ display: 'flex' }}>
                <Box sx={{ marginRight: 4 }}>
                    <Typography variant="h7" sx={{ color: 'black',fontFamily: 'Coolvetica' }}>
                        VWAR:
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#e7552b',fontFamily: 'Coolvetica' }}>
                        {recentData.VWAR}
                    </Typography>
                    <Typography variant="body1" sx={{ color: changeInVWAR >= 0 ? 'green' : 'red',fontFamily: 'Coolvetica' }}>
                        {changeInVWAR >= 0 ? `+${changeInVWAR}` : `${changeInVWAR}`}
                        <span style={{ color: 'gray',marginLeft: '5px' }}>
                            since {previousDate}
                        </span>
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1,marginLeft: '-170px',padding: 2,marginTop: '85px' }}>
                    {chartConfig.title}
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={data}>
                            {chartConfig.xAxis}
                            {chartConfig.yAxis}
                            {chartConfig.tooltip}
                            {chartConfig.line}
                        </LineChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </ChartCard>
    );
};

export default VWARChart;

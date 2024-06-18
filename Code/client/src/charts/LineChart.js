import React from 'react';
import { LineChart,ResponsiveContainer } from 'recharts';
import { getChartConfig } from '../config/chartConfig';
import ChartCard from '../components/ChartCard';
import { Box,Typography } from '@mui/material';

// Utility function to format the date without the year
const formatDateWithoutYear = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'long',day: 'numeric' };
    return date.toLocaleDateString(undefined,options);
};

const LineChartComponent = ({ data,dataKey,title,strokeColor,displayName,overallWinningPercentage,animate }) => {
    const chartConfig = getChartConfig(dataKey,strokeColor,title,displayName,animate);

    // Calculate the change in winning percentage
    const recentData = data.length > 1 ? data[data.length - 1] : null;
    const previousData = data.length > 1 ? data[data.length - 2] : null;
    const changeInWinningPercentage = recentData && previousData
        ? (recentData.winningPercentage - previousData.winningPercentage).toFixed(2)
        : '0.000';
    const previousDate = previousData ? formatDateWithoutYear(previousData.date) : '';

    return (
        <ChartCard>
            <Box sx={{ display: 'flex',padding: 1 }}>
                <Box sx={{ marginRight: 4 }}>
                    <Typography variant="h7" sx={{ color: 'black',fontFamily: 'Coolvetica' }}>
                        Winning Percentage:
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#e7552b',fontFamily: 'Coolvetica' }}>
                        {overallWinningPercentage}%
                    </Typography>
                    <Typography variant="body1" sx={{ color: changeInWinningPercentage >= 0 ? 'green' : 'red',fontFamily: 'Coolvetica' }}>
                        {changeInWinningPercentage >= 0 ? `+${changeInWinningPercentage}` : `${changeInWinningPercentage}`}
                        <span style={{ color: 'gray',marginLeft: '5px' }}>
                            Since {previousDate}
                        </span>
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1,marginLeft: '-180px',marginTop: '15px' }}>
                    {chartConfig.title}
                    <ResponsiveContainer width="100%" height={450}>
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

export default LineChartComponent;

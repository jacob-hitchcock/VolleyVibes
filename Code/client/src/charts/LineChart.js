import React from 'react';
import { LineChart,ResponsiveContainer } from 'recharts';
import { getChartConfig } from '../config/chartConfig';
import ChartCard from '../components/ChartCard';
import { Box,Typography } from '@mui/material';

const LineChartComponent = ({ data,dataKey,title,strokeColor,displayName,overallWinningPercentage }) => {
    const chartConfig = getChartConfig(dataKey,strokeColor,title,displayName);

    return (
        <ChartCard>
            <Box sx={{ display: 'flex',padding: 2 }}>
                <Box sx={{ marginRight: 4 }}>
                    <Typography variant="h6" sx={{ color: 'black',fontFamily: 'Coolvetica' }}>
                        Winning Percentage:
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#e7552b',fontFamily: 'Coolvetica' }}>
                        {overallWinningPercentage}%
                    </Typography>
                </Box>
                <Box sx={{ flexGrow: 1,marginLeft: '-200px' }}>
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

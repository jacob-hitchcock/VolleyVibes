// src/components/charts/LineChart.js

import React from 'react';
import { LineChart,ResponsiveContainer } from 'recharts';
import { getChartConfig } from '../config/chartConfig';
import ChartCard from '../components/ChartCard';

const LineChartComponent = ({ data,dataKey,title,strokeColor,displayName }) => {
    const chartConfig = getChartConfig(dataKey,strokeColor,title,displayName);

    return (
        <ChartCard>
            {chartConfig.title}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    {chartConfig.tooltip}
                    {chartConfig.legend}
                    {chartConfig.line}
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default LineChartComponent;

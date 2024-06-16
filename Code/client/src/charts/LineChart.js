// src/components/charts/LineChart.js

import React from 'react';
import { LineChart,ResponsiveContainer } from 'recharts';
import { getChartConfig } from '../config/chartConfig';

const LineChartComponent = ({ data,dataKey,title,strokeColor,displayName }) => {
    const chartConfig = getChartConfig(dataKey,strokeColor,title,displayName);

    return (
        <div className="line-chart-container">
            {chartConfig.title}
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                    {chartConfig.grid}
                    {chartConfig.xAxis}
                    {chartConfig.yAxis}
                    {chartConfig.tooltip}
                    {chartConfig.legend}
                    {chartConfig.line}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LineChartComponent;

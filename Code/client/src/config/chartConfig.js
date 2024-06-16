// src/config/chartConfig.js

import React from 'react';
import { CartesianGrid,XAxis,YAxis,Tooltip,Legend,Line } from 'recharts';
import { formatDate } from '../utils/utils';

// Custom tooltip component
const CustomTooltip = ({ active,payload,label }) => {
    if(active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`Date: ${formatDate(label)}`}</p>
                <p className="intro">{`${payload[0].name}: ${payload[0].value}%`}</p>
            </div>
        );
    }

    return null;
};

export const getChartConfig = (dataKey,strokeColor = "#e7552b",title,displayName) => ({
    grid: <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />,
    xAxis: <XAxis dataKey="date" tickFormatter={formatDate} />,
    yAxis: <YAxis />,
    tooltip: <Tooltip content={<CustomTooltip />} />,
    legend: <Legend verticalAlign="top" height={36} />,
    line: (
        <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            dot={false}
            isAnimationActive={true}
            animationDuration={1500}
            strokeWidth={3}
            strokeLinecap="round"
            name={displayName}
        />
    ),
    title: <h2 style={{ paddingLeft: '16px' }}>{title}</h2>,
});

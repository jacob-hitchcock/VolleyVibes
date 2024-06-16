// src/config/chartConfig.js

import React from 'react';
import { XAxis,YAxis,Tooltip,Legend,Line } from 'recharts';
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
    xAxis: <XAxis dataKey="date" tickFormatter={formatDate} hide={true} />,
    yAxis: <YAxis domain={['dataMin-5','dataMax+5']} hide={true} />, // add cases to stop at 0 and 100
    tooltip: <Tooltip content={<CustomTooltip />} />,
    legend: <Legend verticalAlign="top" height={36} />,
    line: (
        <Line
            type="monotone"
            dataKey={dataKey}
            stroke={strokeColor}
            dot={true}
            isAnimationActive={true}
            animationDuration={1500}
            strokeWidth={3}
            strokeLinecap="round"
            name={displayName}
        />
    ),
});
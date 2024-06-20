// src/config/chartConfig.js

import React from 'react';
import { XAxis,YAxis,Tooltip,Legend,Line } from 'recharts';
import { formatDate } from '../utils/utils';

// Custom tooltip component
const CustomTooltip = ({ active,payload,label }) => {
    if(active && payload && payload.length) {
        return (
            <div className="custom-tooltip"
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    borderRadius: '15px',
                    padding: '15px',
                    fontSize: '14px',
                }}>
                <p className="label">{`Date: ${formatDate(label)}`}</p>
                {payload.map((entry,index) => (
                    <p key={`item-${index}`} className="intro">{`${entry.name}: ${entry.value}`}</p>
                ))}
            </div>
        );
    }

    return null;
};

export const vwarChartConfig = (dataKey,strokeColor = "#e7552b",title,displayName,animate) => ({
    xAxis: <XAxis dataKey="date" tickFormatter={formatDate} hide={true} />,
    yAxis: <YAxis domain={['dataMin-9','dataMax+10']} hide={true} />, // add cases to stop at 0 and 100
    tooltip: <Tooltip content={<CustomTooltip />} />,
    legend: <Legend verticalAlign="bottom" height={36} />,
    line: (
        <>
            <Line
                type="monotone"
                dataKey="VWAR"
                stroke={strokeColor}
                dot={true}
                isAnimationActive={animate}
                animationDuration={1500}
                strokeWidth={3}
                strokeLinecap="round"
                name={displayName}
            />
            <Line
                type="monotone"
                dataKey="cumulativeWins"
                stroke="#ffc658" // Choose a different color for the cumulative wins line
                dot={true}
                isAnimationActive={animate}
                animationDuration={1500}
                strokeWidth={3}
                strokeLinecap="round"
                name="Total Wins"
            />
            <Line
                type="monotone"
                dataKey="baseline"
                stroke="#977e57" // Choose a different color for the cumulative wins line
                dot={true}
                isAnimationActive={animate}
                animationDuration={1500}
                strokeWidth={3}
                strokeLinecap="round"
                name="Baseline Cumulative Wins"
            />
        </>
    ),
});
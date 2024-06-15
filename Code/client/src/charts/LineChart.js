// src/components/charts/LineChart.js

import React from 'react';
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer } from 'recharts';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US',{ month: '2-digit',day: '2-digit',year: '2-digit' }).format(date);
};

const CustomTooltip = ({ active,payload,label }) => {
    if(active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`Date: ${formatDate(label)}`}</p>
                <p className="intro">{`Winning Percentage: ${payload[0].value}%`}</p>
            </div>
        );
    }

    return null;
};

const LineChartComponent = ({ data }) => (
    <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="date" tickFormatter={formatDate} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line
                type="monotone"
                dataKey="winningPercentage"
                stroke="#e7552b"
                dot={false}
                isAnimationActive={true}
                animationDuration={1500}
                strokeWidth={3}
                strokeLinecap="round"
            />
        </LineChart>
    </ResponsiveContainer>
);

export default LineChartComponent;

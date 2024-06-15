// src/components/charts/LineChart.js

import React from 'react';
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend,ResponsiveContainer } from 'recharts';
import { formatDate } from '../utils/utils';

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

const LineChartComponent = ({ data,title }) => (
    <div>
        {title && <h3 style={{ textAlign: 'center' }}>{title}</h3>}
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" tickFormatter={formatDate} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" height={36} />
                <Line
                    type="monotone"
                    stroke="#e7552b"
                    dot={false}
                    isAnimationActive={true}
                    animationDuration={1500}
                    strokeWidth={3}
                    strokeLinecap="round"
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export default LineChartComponent;

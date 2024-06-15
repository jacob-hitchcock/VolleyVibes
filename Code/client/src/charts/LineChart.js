// src/components/charts/LineChart.js

import React from 'react';
import { LineChart,Line,XAxis,YAxis,CartesianGrid,Tooltip,Legend } from 'recharts';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US',{ month: '2-digit',day: '2-digit',year: '2-digit' }).format(date);
};

const LineChartComponent = ({ data }) => (
    <LineChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={formatDate} />
        <YAxis />
        <Tooltip labelFormatter={formatDate} />
        <Legend />
        <Line type="monotone" dataKey="winningPercentage" stroke="#e7552b" activeDot={{ r: 8 }} />
    </LineChart>
);

export default LineChartComponent;

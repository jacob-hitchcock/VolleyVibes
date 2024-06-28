import React from 'react';
import { PieChart,Pie,Cell,Tooltip,ResponsiveContainer,Sector } from 'recharts';

const COLORS = ['#977e57','#e7552b','#ffc658'];

const renderActiveShape = (props) => {
    const { cx,cy,innerRadius,outerRadius,startAngle,endAngle,fill,payload } = props;

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};

const DoughnutChartComponent = ({ data,dataKey,title,animate }) => {
    return (
        <div style={{ width: '100%',height: '100%' }}>
            <h3 style={{ textAlign: 'center',fontFamily: 'Coolvetica' }}>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey={dataKey}
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        fill="#8884d8"
                        paddingAngle={2}
                        activeShape={renderActiveShape}
                        isAnimationActive={animate}
                        label
                    >
                        {data.map((entry,index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip active={false} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DoughnutChartComponent;

import React from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const AreaGraph = ({ file, color, width, height }) => {
    return (
        <ResponsiveContainer width={width} height={height}>
            <AreaChart
                width={500}
                height={400}
                file={file}
                margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke={color} fill={color} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export default AreaGraph;

import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LineGraph =({file, color, width, height}) => {
    return(
        <ResponsiveContainer width={width} height={height}>
            <lineChart
            file={file}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type='monotone' dataKey={'uv'} stroke={color} />
            {/* <CartesianGrid stroke='#ccc' strokeDasharray='5 5' /> */}
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />

            </lineChart>
        </ResponsiveContainer>
    )
}

export default LineGraph;

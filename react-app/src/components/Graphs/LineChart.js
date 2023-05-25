import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LineChart =({file}) => {
    return(
        <ResponsiveContainer width='100%' height="50%">
            <lineChart
            file={file}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type='monotone' dataKey={'uv'} stroke="#8884d8" />
            <CartesianGrid stroke='#ccc' strokeDasharray='5 5' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />

            </lineChart>
        </ResponsiveContainer>
    )
}

export default LineChart;

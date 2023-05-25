import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChart = ({file}) =>{
    return(
        <ResponsiveContainer width="100%" height="50%">
            <BarChart
            width={500}
            height={300}
            file={file}
            margin={{
                top: 5, right: 30, left: 20, bottom: 5
            }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey ="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='pv' fill="8884d8" />

            </BarChart>
        </ResponsiveContainer>
    )
}
export default BarChart

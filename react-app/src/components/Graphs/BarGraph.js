import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";

const BarGraph = ({file, color, width, height}) =>{
    const [data, setData] = useState([]);

    
    return(
        <ResponsiveContainer width={width} height={height}>
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
                <Bar dataKey='pv' fill={color} />

            </BarChart>
        </ResponsiveContainer>
    )
}
export default BarGraph

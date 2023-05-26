import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS =['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF']

const CircleGraph = ({ file, color, width, height }) => {
    <ResponsiveContainer width={width} height={color}>
        <PieChart>
            <Pie
                file={file}
                cx='50%'
                cy='50%'
                labelLine={false}
                outerRadius={80}
                fill='#8884d8'
                dataKey=""
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
                {
                    data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                }

            </Pie>
        </PieChart>
    </ResponsiveContainer>
}

export default CircleGraph

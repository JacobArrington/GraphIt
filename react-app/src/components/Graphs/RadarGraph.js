import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const RadarGraph =({file, color, width, height}) =>{
    return(
        <ResponsiveContainer width={width} height={height}>
            <RadarChart cx="50%" cy='50%' outerRadius='80%' file={file}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis />
                <Radar name="" dataKey="" storke={color} fill={color} fillOpacity={0.6} />

            </RadarChart>
        </ResponsiveContainer>
    )
}
export default RadarGraph;

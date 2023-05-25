import React from react 
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const RadarChart =({data}) =>{
    return(
        <ResponsiveContainer width="100%" height='100%'>
            <RadarChart cx="50%" cy='50%' outerRadius='80%' data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="" />
                <PolarRadiusAxis />
                <Radar name="" dataKey="" storke='#8884d8' fill='#8884d8' fillOpacity={0.6} />

            </RadarChart>
        </ResponsiveContainer>
    )
}
export default RadarChartComponent;

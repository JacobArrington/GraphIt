import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";


const RadarGraph =({selectedFileData, color, width, height}) =>{
    const [axisKey, setAxisKey] = useState('');
    const [dataKey, setDataKey] = useState('');

        
    useEffect(() => {
        if (selectedFileData && selectedFileData.length > 0) {
            const keys = Object.keys(selectedFileData[0]);
            keys.forEach((key) => {
                if (typeof selectedFileData[0][key] === "string") {
                    setAxisKey(key);
                }
                else if (typeof selectedFileData[0][key] === "number") {
                    setDataKey(key);
                }
            });
            // console.log('selectedFileData:', selectedFileData);
            // console.log('dataKey:', dataKey);
            // console.log('axisKey:', axisKey)
        }
    }, [selectedFileData]);
    
    return(
        <div style={{ width: `${width}%`, height: `${height}px` }}>
        <ResponsiveContainer width={width + '%'} height={height}>
            <RadarChart cx="50%" cy='50%' outerRadius='80%' data={selectedFileData}>
                <PolarGrid />
                <PolarAngleAxis dataKey={axisKey} />
                <PolarRadiusAxis />
                <Radar  dataKey={dataKey} storke='#000000' fill={color} fillOpacity={0.5} />

            </RadarChart>
        </ResponsiveContainer>
        </div>
    )
}
export default RadarGraph;

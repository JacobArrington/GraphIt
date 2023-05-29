import { useEffect, useState } from 'react';
import React from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const LineGraph =({selectedFileData, color, width, height}) => {
    const [xAxisKey, setXAxisKey] = useState( '');
    const [lineDataKey, setLineDataKey] = useState( '');

    useEffect(() => {
        if (selectedFileData && selectedFileData.length > 0) {
            const keys = Object.keys(selectedFileData[0]);
            keys.forEach((key) => {
                if (typeof selectedFileData[0][key] === "string") {
                    setXAxisKey(key);
                }
                else if (typeof selectedFileData[0][key] === "number") {
                    setLineDataKey(key);
                }
            });
            // console.log('selectedFileData:', selectedFileData);
            // console.log('lineDataKey:', lineDataKey);
            // console.log('xAxisKey:', xAxisKey)
        }
    }, [selectedFileData]);

    return(
        <ResponsiveContainer width={width + '%'} height={height}>
            <LineChart
            data={selectedFileData}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type='monotone' dataKey={lineDataKey} stroke={color} />
            {/* <CartesianGrid stroke='#ccc' strokeDasharray='5 5' /> */}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />

            </LineChart>
        </ResponsiveContainer>
    )
}

export default LineGraph;

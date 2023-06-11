import React from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';
import { useEffect, useState } from "react";
const AreaGraph = ({ chartData, color, width, height, selectedFileData}) => {
    const [xAxisKey, setXAxisKey] = useState( '');
    const [areaGraphKey, setAreaGraphKey] = useState( '');

    useEffect(() => {
        if (selectedFileData && selectedFileData.length > 0) {
            const keys = Object.keys(selectedFileData[0]);
            keys.forEach((key) => {
                if (typeof selectedFileData[0][key] === "string") {
                    setXAxisKey(key);
                }
                else if (typeof selectedFileData[0][key] === "number") {
                    setAreaGraphKey(key);
                }
            });
        //     console.log('selectedFileData:', selectedFileData);
        //     console.log('areaGraphKey:', areaGraphKey);
        //     console.log('xAxisKey:', xAxisKey)
         }
    }, [selectedFileData]);

    return (
        <div style={{ width: `${width}%`, height: `${height}px` }}>
        <ResponsiveContainer >
            <AreaChart
               
                data={selectedFileData}
                margin={{
                    top: 10, right: 30, left: 0, bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey={areaGraphKey} stroke={color} fill={color} />
            </AreaChart>
        </ResponsiveContainer>
        </div>
    );
}

export default AreaGraph;

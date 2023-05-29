import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";

const BarGraph = ({file, color, width, height, selectedFileData, }) =>{
    const [xAxisKey, setXAxisKey] = useState( '');
    const [barDataKey, setBarDataKey] = useState( '');


 
    
    useEffect(() => {
        if (selectedFileData && selectedFileData.length > 0) {
            const keys = Object.keys(selectedFileData[0]);
            keys.forEach((key) => {
                if (typeof selectedFileData[0][key] === "string") {
                    setXAxisKey(key);
                }
                else if (typeof selectedFileData[0][key] === "number") {
                    setBarDataKey(key);
                }
            });
            console.log('selectedFileData:', selectedFileData);
            console.log('barDataKey:', barDataKey);
            console.log('xAxisKey:', xAxisKey)
        }
    }, [selectedFileData]);
    return (
        <div>
            
    
            {selectedFileData.length > 0 && xAxisKey && barDataKey &&
                <ResponsiveContainer width={width + '%'} height={height}>
                    <BarChart
                        data={selectedFileData}
                        margin={{
                            top: 5, right: 30, left: 20, bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={xAxisKey}/>
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={barDataKey} fill={color} />
                    </BarChart>
                </ResponsiveContainer>
            }
        </div>
    )
        }  
export default BarGraph

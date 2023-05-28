import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";

const BarGraph = ({file, color, width, height}) =>{
    const [chartData, setChartData] = useState([]);
    const [xAxisKey, setXAxisKey] = useState('');
    const [barDataKey, setBarDataKey] = useState('');

    useEffect(() => {
        fetch(`/api/files/${file}`)
        .then(response => response.json())
        .then(data => {
            console.log('Data: ', data)
            setChartData(data)})
        .catch(error => console.error(error))
    },[file])

    const previewData = chartData.slice(0, 5); // Get the first 5 rows for preview

    return (
        <div>
            <label>
                X Axis:
                <input 
                    type="text" 
                    value={xAxisKey} 
                    onChange={(e) => setXAxisKey(e.target.value)}
                    placeholder="Enter field name for X Axis"
                />
            </label>
            <label>
                Bar Data:
                <input 
                    type="text" 
                    value={barDataKey} 
                    onChange={(e) => setBarDataKey(e.target.value)}
                    placeholder="Enter field name for Bar Data"
                />
            </label>
    
            <div className='data-preview'>
                <h3>Data Preview</h3>
                <table>
                    <thead>
                        <tr>
                            {Object.keys(previewData[0]).map((key, index) => <th key={index}>{key}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {previewData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.values(row).map((value, valueIndex) => <td key={valueIndex}>{value}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    
            {chartData.length > 0 &&
                <ResponsiveContainer width={width + '%'} height={height}>
                    <BarChart
                        data={chartData}
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

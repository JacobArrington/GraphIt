import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList, Label} from 'recharts';

const data = [
  {name: 'G', uv: 4000, amt: 2400},
  {name: 'R', uv: 3000, amt: 2210},
  {name: 'A', uv: 2000, amt: 2290},
  {name: 'P', uv: 2780, amt: 2000},
  {name: 'H', uv: 1890, amt: 2181},
  {name: 'I', uv: 2390, amt: 2500},
  {name: 'T', uv: 3490, amt: 2100},
];

const CustomizedLabel = (props) => {
  const { x, y, value, width, viewBox } = props;
  const xOffset = (viewBox.width / data.length) / 2;

  return (
    <text 
      x={x + xOffset} 
      y={y} 
      dy={-4} 
      fontSize={35} 
      fontWeight="bold" 
      textAnchor="middle"
    >
      {value}
    </text>
  );
};

const LandingPage = () => {
  return (
    <div>
      <header>
        <h2>Welcome to Graph It!</h2>
      </header>
      
      <main>
        

        <ResponsiveContainer width="80%" height={800}>
          <BarChart data={data} margin={{top: 30, right: 30, left: 20, bottom: 5}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={false}>
              <Label value='B e l o n g s H e r e' offset={0} position='insideBottom' style={{fontSize: '24px', fontWeight: 'bold',fill: '#000', letterSpacing:'2.8rem', textTransform: 'uppercase'}} />
            </XAxis>
            <YAxis tick={false}>
              <Label angle={-90} value='Y o u r D a t a' position='insideLeft' offset={-1} style={{fontSize: '24px',fontWeight: 'bold',fill: '#000',letterSpacing:'2.0rem', textTransform: 'uppercase'}} dx={35} dy={290}/>
            </YAxis>
            <Tooltip />
            <Legend />
            <Bar dataKey="uv" fill="#8884d8">
              <LabelList dataKey="name" position="top" content={<CustomizedLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </main>
    </div>
  );
}

export default LandingPage;

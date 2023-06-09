import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, LabelList } from 'recharts';
import { demoLogin } from '../../store/session';

const initData = [
  {name: 'G', uv: 50, amt: 20, x:10},
  {name: 'R', uv: 100, amt: 40, x:20},
  {name: 'A', uv: 150, amt: 60, x:30},
  {name: 'P', uv: 50, amt: 80, x:40},
  {name: 'H', uv: 200, amt: 100, x:50},
  {name: 'I', uv: 250, amt: 120, x:60},
  {name: 'T', uv: 100, amt: 140, x:70},
];

const VerticalLabel = ({ viewBox, value }) => {
  const { x, y, width, height } = viewBox;
  
  const letters = value.split('');
  const LETTER_HEIGHT = 44;

  return letters.map((letter, index) => (
    <text
      key={index}
      x={x + width - LETTER_HEIGHT / 2}
      y={y + height - LETTER_HEIGHT * index - 15}
      textAnchor="middle"
      dominantBaseline="central"
      style={{fontSize: 24, fontWeight: 'bold', letterSpacing:'2.8rem'}}
      dx={35} 
      dy={-50}
    >
      {letter}
    </text>
  ));
};

const LandingPage = () => {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  const [data, setData] = useState(initData)
  useEffect(() => {
    const timer = setInterval(() => {
      setData(data => data.map(item => ({
        ...item, 
        uv: item.uv + Math.floor(Math.random() * 500),
        amt: item.amt + Math.floor(Math.random() * 350),
        x: item.x + Math.floor(Math.random() * 450),
      })));
    }, 500);
    
    return () => clearInterval(timer);
  }, []);

  if (sessionUser) return <Redirect to="/library" />

  const demoSubmit = () => {
    dispatch(demoLogin())
  }

  return (
    <div>
      <header>
        <h2>Welcome to Graph It!</h2>
      </header>

      <ResponsiveContainer width="80%" height={800}>
        <ComposedChart data={data} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={false}>
            <Label value='B E L O N G S H E R E' offset={0} position='insideBottom' style={{fontSize: '24px', fontWeight: 'bold',fill: '#000', letterSpacing:'2.8rem', textTransform: 'uppercase'}} />
          </XAxis>
          <YAxis tick={false}>
            <Label content={<VerticalLabel />} value='A T A D R U O Y' position='insideLeft' offset={-1} style={{fontSize: '24px',fontWeight: 'bold',fill: '#000',letterSpacing:'2.0rem', textTransform: 'uppercase',}} />
          </YAxis>
          <Tooltip />
          <Legend />
          <Area type="monotone" dataKey="uv" areaSize={100} fill="#540d6e" stroke="#2e2157"/>
          <Bar dataKey="amt" barSize={100} fill="#2e2157">
          
          </Bar>
            
          
          <Line type="monotone" dataKey="x" stroke="#920075" />
          
          
        </ComposedChart>
      </ResponsiveContainer>
      <div>
        <button onClick={demoSubmit}>Demo Login</button>
      </div>
    </div>
  );
}

export default LandingPage;

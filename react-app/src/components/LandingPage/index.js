import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, LabelList } from 'recharts';
import { demoLogin } from '../../store/session';
import './landing.css'

const initData = [
  {name: 'G', uv: 50, amt: 20, x:20},
  {name: 'R', uv: 100, amt: 40, x:60},
  {name: 'A', uv: 150, amt: 60, x:100},
  {name: 'P', uv: 50, amt: 80, x:140},
  {name: 'H', uv: 90, amt: 100, x:180},
  {name: 'I', uv: 250, amt: 120, x:220},
  {name: 'T', uv: 100, amt: 140, x:260},
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
      dx={20} 
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
    <div className='landing-container'>
      <div className='wlcm'>
        <h2>Welcome to Graph It!</h2>
      </div>

      <div className='demo-container'>
        <button className='demo-btn'onClick={demoSubmit}>Demo Login</button>
        
      </div>

      
      <div className='landing-graph-container'>
      <ResponsiveContainer width="80%" height={750}>
        <ComposedChart data={data} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
        <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor=" 	#eeaf61 " stopOpacity={1}/>
      <stop offset="100%" stopColor="#fb9062" stopOpacity={1}/>
    </linearGradient>
    <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#CB4258" stopOpacity={1}/>
      <stop offset="100%" stopColor="#0072ff" stopOpacity={1}/>
    </linearGradient>
  </defs>
          
          <XAxis dataKey="name" tick={false}>
            <Label value='B E L O N G S H E R E' offset={0} position='insideBottom' style={{fontSize: '24px', fontWeight: 'bold',fill: '#000', letterSpacing:'2.5rem', textTransform: 'uppercase'}} />
          </XAxis>
          <YAxis tick={false}>
            <Label content={<VerticalLabel />} value='A T A D R U O Y' position='insideLeft' offset={-1} style={{fontSize: '24px',fontWeight: 'bold',fill: '#000',letterSpacing:'2.1rem', textTransform: 'uppercase',}} />
          </YAxis>
          <Tooltip />
        
          <Area type="monotone" dataKey="uv" areaSize={100} fill="url(#colorUv)" stroke="#2e2157"/>
          <Bar dataKey="amt" barSize={100} fill="url(#colorAmt)">
          
          </Bar>
            
          
          <Line type="monotone" dataKey="x" stroke="#920075" />
          
          
        </ComposedChart>
      </ResponsiveContainer>
      </div>

      <div className='about'>
  <h2>Created by Jacob Arrington</h2>
  <ul className='Social'>
    <li>
      <a href="https://www.linkedin.com/in/jacob-arrington-190885278/" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-linkedin"></i>
        
      </a>
    </li>
    <li>
      <a href="https://wellfound.com/u/jacob-arrington-1" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-angellist"></i>
        
      </a>
    </li>
    <li>
      <a href="https://github.com/JacobArrington" target="_blank" rel="noopener noreferrer">
        <i className="fab fa-github"></i>
        
      </a>
    </li>
  </ul>
</div>
     
    </div>
  );
}

export default LandingPage;

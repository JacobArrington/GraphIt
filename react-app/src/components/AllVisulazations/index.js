import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVisualization } from '../../store/visulazation';
import LineGraph from '../Graphs/LineGraph';
import AreaGraph from '../Graphs/AreaGraph';
import PieGraph from '../Graphs/CircleGraph';
import RadarGraph from '../Graphs/RadarGraph';
import BarGraph from '../Graphs/BarGraph.js';


const AllVisualizations = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.session.user)
    const allVis = useSelector(state => state.visulizationReducer)
    const userVis = []

    useEffect(() => {
      dispatch(fetchVisualization())
    }, [dispatch, allVis && Object.keys(allVis).length])


    for(let id in allVis){
        if(allVis[id].user_id === currentUser.id){
            userVis.push(allVis[id])
        }
    }
    const getGraphComponent = (type, file, color, width, height) => {
        switch (type) {
          case 'bar':
            return <BarGraph file={file} color={color} width={width} height={height} />
          case 'line':
            return <LineGraph file={file} color={color} width={width} height={height} />
          case 'area':
            return <AreaGraph file={file} color={color} width={width} height={height} />
          case 'circle':
            return <PieGraph file={file} color={color} width={width} height={height} />
          case 'radar':
            return <RadarGraph file={file} color={color} width={width} height={height} />
          default:
            return null;
        }
      }
      
  return (
    <div className='visualization-container'>
      <h2 className='visualization-header'>Your Visualizations</h2>
      <div className='visualization-list'>
        {userVis.map((visualization, index) => (
          <div key={index} className='visualization-list-item'>
            <h4 className='title'>{visualization.title}</h4>
            <p className='details'>{visualization.description}</p>
            {getGraphComponent(visualization.visualization_type, visualization.data_file_id, visualization.color, visualization.width, visualization.height)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVisualizations;

// import React from 'react';
//  import BarGraph from '../Graphs/BarGraph';

// function AllVisualizations() {
//   return (
//     <div>
//       <h1>My Bar Graph</h1>
//       <BarGraph color="#8884d8" width={100} height={500} />
//     </div>
//   );
// }

// export default AllVisualizations;

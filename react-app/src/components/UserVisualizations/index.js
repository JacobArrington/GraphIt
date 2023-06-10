import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { fetchVisualization } from '../../store/visualization';
import LineGraph from '../Graphs/LineGraph';
import AreaGraph from '../Graphs/AreaGraph';
// import PieGraph from '../Graphs/CircleGraph';
import RadarGraph from '../Graphs/RadarGraph';
import BarGraph from '../Graphs/BarGraph';

const UserVisualizations = () => {
  const dispatch = useDispatch();
  const history = useHistory()
  const currentUser = useSelector((state) => state.session.user);
  const userVis = useSelector((state) => state.visualizationReducer);
  const [graphSize, setGraphSize] = useState({width: 50, height: 200});

  useEffect(() => {
    dispatch(fetchVisualization());
  }, [dispatch]);

  const handleVisualizationClick = (id) => {
    history.push(`/graph/${id}`)
  }

  const getGraphComponent = (visualization) => {
    const { visualization_type, data_file_id, color, chart_data } = visualization;
    switch (visualization_type) {
      case 'bar':
        return <BarGraph file={data_file_id} color={color} width={graphSize.width} height={graphSize.height} selectedFileData={chart_data} />;
      case 'line':
        return <LineGraph file={data_file_id} color={color} width={graphSize.width} height={graphSize.height} selectedFileData={chart_data} />;
      case 'area':
        return <AreaGraph file={data_file_id} color={color} width={graphSize.width} height={graphSize.height} selectedFileData={chart_data} />;
      // case 'circle':
      //   return <PieGraph file={data_file_id} color={color} width={width} height={height} selectedFileData={chart_data} />;
      case 'radar':
        return <RadarGraph file={data_file_id} color={color} width={graphSize.width} height={graphSize.height} selectedFileData={chart_data} />;
      default:
        return null;
    }
  };

  return (
    <div className='visualization-container'>
      <h2 className='visualization-header'>My Visualizations</h2>
      <div className='visualization-list'>
        {Object.values(userVis)
        .filter(visualization => currentUser && visualization.user_id === currentUser.id)
        .map((visualization) => (
          <div key={visualization.id} className='visualization-list-item' onClick={() => handleVisualizationClick(visualization.id)}>
            <h4 className='title'>{visualization.title}</h4>
            <p className='details'>{visualization.description}</p>
            {getGraphComponent(visualization)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserVisualizations;
